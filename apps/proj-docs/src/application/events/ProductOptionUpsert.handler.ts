import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { Product_Option, Product_Image } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import ProductOptionUpsertEvent from "./ProductOptionUpsert.event";

@EventsHandler(ProductOptionUpsertEvent)
export default class ProductOptionUpsertHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ table, before, after }: ProductOptionUpsertEvent) {
    switch (table) {
      case "product_options": {
        const { id: option_id, option_group_id, ...rest } = after as Product_Option;
        {
          const { modifiedCount } = await this.catalog_query_repository.update(
            {
              "option_groups.id": option_group_id,
              "option_groups.options.id": option_id,
            },
            { $set: { "option_groups.$[group].options.$[option]": { id: option_id, ...rest } } },
            { arrayFilters: [{ "group.id": option_group_id }, { "option.id": option_id }] },
          );

          if (!modifiedCount) {
            await this.catalog_query_repository.update(
              { "option_groups.id": option_group_id },
              { $push: { "option_groups.$[group].options": { id: option_id, ...rest } } },
              { arrayFilters: [{ "group.id": option_group_id }] },
            );
          }
        }
        {
          const before_stock = (before as Product_Option)?.stock ?? 0;
          const after_stock = (after as Product_Option)?.stock ?? 0;

          await this.summary_query_repository.updateOne(
            { id: option_group_id },
            { $inc: { stock: after_stock - before_stock } },
            { upsert: true },
          );
        }
        break;
      }

      case "product_images": {
        const { id, product_id, ...rest } = after as Product_Image;
        {
          const catalog = await this.catalog_query_repository.findOne({ id: product_id });

          const images = [
            ...(catalog?.images?.filter((image) => image.id !== id) ?? []),
            { id, ...rest },
          ];

          await this.catalog_query_repository.updateOne(
            { id: product_id },
            { images },
            { upsert: true },
          );
        }
        {
          if (!rest.is_primary) break;

          const { url, alt_text } = rest;

          await this.summary_query_repository.updateOne(
            { id: product_id },
            { primary_image: { url, alt_text } },
            { upsert: true },
          );
        }
        break;
      }
    }
  }
}
