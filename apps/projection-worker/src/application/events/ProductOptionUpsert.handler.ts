import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "query/domain/repositories";
import { ProductCatalogModel, ProductSummaryModel } from "query/mongo/models";
import { ProductImageEntity, ProductOptionEntity } from "query/rdb/entities";

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
        const { id: option_id, option_group_id, ...rest } = after as ProductOptionEntity;
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
          const before_stock = (before as ProductOptionEntity)?.stock ?? 0;
          const after_stock = (after as ProductOptionEntity)?.stock ?? 0;
          await this.summary_query_repository.updateOne(
            { id: option_group_id },
            { $inc: { stock: after_stock - before_stock } },
            { upsert: true },
          );
        }
        break;
      }

      case "product_images": {
        const { id, product_id, ...rest } = after as ProductImageEntity;
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
