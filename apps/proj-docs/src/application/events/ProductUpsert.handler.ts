import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import {
  Product,
  Product_Detail,
  Product_Category,
  Product_Price,
  Product_Option_Group,
  Product_Tag,
} from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import {
  BrandStateModel,
  CategoryStateModel,
  SellerStateModel,
  TagStateModel,
} from "../../infrastructure/model";
import ProductUpsertEvent from "./ProductUpsert.event";

@EventsHandler(ProductUpsertEvent)
export default class ProductUpsertHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
    @Inject("ICategoryStateRepository")
    private readonly category_state_repository: IQueryRepository<CategoryStateModel>,
    @Inject("ITagStateRepository")
    private readonly tag_state_repository: IQueryRepository<TagStateModel>,
    @Inject("IBrandStateRepository")
    private readonly brand_state_repository: IQueryRepository<BrandStateModel>,
    @Inject("ISellerStateRepository")
    private readonly seller_state_repository: IQueryRepository<SellerStateModel>,
  ) {}

  async handle({ table, after }: ProductUpsertEvent) {
    switch (table) {
      case "products": {
        const { brand_id, seller_id, ...product } = after as Product;

        const brand = await this.brand_state_repository.findOne({ id: brand_id });
        const seller = await this.seller_state_repository.findOne({ id: seller_id });

        await this.catalog_query_repository.updateOne(
          { id: product.id },
          {
            ...product,
            brand,
            seller,
          },
          { upsert: true },
        );

        await this.summary_query_repository.updateOne(
          { id: product.id },
          {
            ...product,
            ...(brand ? { brand: { id: brand.id, name: brand.name } } : {}),
            ...(seller ? { seller: { id: seller.id, name: seller.name } } : {}),
          },
          { upsert: true },
        );
        break;
      }

      case "product_details": {
        const { product_id, ...detail } = after as Product_Detail;

        await this.catalog_query_repository.updateOne(
          { id: product_id },
          { detail },
          { upsert: true },
        );
        break;
      }

      case "product_categories": {
        const { product_id, category_id, is_primary } = after as Product_Category;

        const catalog = await this.catalog_query_repository.findOne({ id: product_id });

        const [category] = await this.category_state_repository.aggregate([
          { $match: { id: category_id } },
          {
            $lookup: {
              from: this.category_state_repository.model_name,
              let: { parentId: "$parent_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$id", "$$parentId"] } } },
                { $project: { _id: 0, id: 1, name: 1, slug: 1 } },
              ],
              as: "parent",
            },
          },
          { $unwind: { path: "$parent", preserveNullAndEmptyArrays: true } },
        ]);

        const updated_categories = [
          ...(catalog?.categories ?? []).filter((c) => c?.id !== category_id),
          { ...category, is_primary },
        ];

        await this.catalog_query_repository.updateOne(
          { id: product_id },
          { categories: updated_categories },
          { upsert: true },
        );

        await this.summary_query_repository.updateOne(
          { id: product_id },
          { categories: updated_categories.map((c) => c.id) },
          { upsert: true },
        );

        await this.category_state_repository.updateOne(
          { id: category_id },
          { $inc: { product_count: 1 } },
        );

        break;
      }

      case "product_prices": {
        const { product_id, ...price } = after as Product_Price;

        const discount_percentage =
          ((price.base_price - (price.sale_price ?? 0)) * 100) / price.base_price;

        await this.catalog_query_repository.updateOne(
          { id: product_id },
          { price: { ...price, discount_percentage } },
          { upsert: true },
        );
        await this.summary_query_repository.updateOne({ id: product_id }, price);
        break;
      }

      case "product_option_groups": {
        const { id: option_group_id, product_id, ...rest } = after as Product_Option_Group;

        const { modifiedCount } = await this.catalog_query_repository.update(
          {
            id: product_id,
            "option_groups.id": option_group_id,
          },
          { $set: { "option_groups.$": { id: option_group_id, ...rest } } },
        );

        if (!modifiedCount) {
          await this.catalog_query_repository.update(
            { id: product_id },
            { $push: { option_groups: { id: option_group_id, options: [], ...rest } } },
          );
        }
        break;
      }

      case "product_tags": {
        const { product_id, tag_id } = after as Product_Tag;

        const catalog = await this.catalog_query_repository.findOne({ id: product_id });

        const tag = await this.tag_state_repository.findOne({ id: tag_id });

        const updated_tags = [...(catalog?.tags ?? []).filter((t) => t?.id !== tag_id), tag];

        await this.catalog_query_repository.updateOne(
          { id: product_id },
          { tags: updated_tags },
          { upsert: true },
        );
        break;
      }
    }
  }
}
