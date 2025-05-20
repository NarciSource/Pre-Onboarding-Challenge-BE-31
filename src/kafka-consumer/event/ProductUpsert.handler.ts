import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { CategoryModel, TagModel } from "@kafka-consumer/model";
import { IQueryRepository } from "@shared/repositories";
import {
  ProductEntity,
  ProductDetailEntity,
  ProductCategoryEntity,
  ProductPriceEntity,
  ProductOptionGroupEntity,
  ProductTagEntity,
} from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import ProductUpsertEvent from "./ProductUpsert.event";

@EventsHandler(ProductUpsertEvent)
export default class ProductUpsertHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
    @Inject("ICategoryStateRepository")
    private readonly category_state_repository: IQueryRepository<CategoryModel>,
    @Inject("ITagStateRepository")
    private readonly tag_state_repository: IQueryRepository<TagModel>,
  ) {}

  async handle({ table, after }: ProductUpsertEvent) {
    switch (table) {
      case "products": {
        const { brand_id, seller_id, ...product } = after as ProductEntity;

        await this.catalog_query_repository.update(product.id, {
          ...product,
          brand: { id: brand_id },
          seller: { id: seller_id },
        });

        await this.summary_query_repository.update(product.id, {
          ...product,
          brand: { id: brand_id },
          seller: { id: seller_id },
        });
        break;
      }

      case "product_details": {
        const { product_id, ...detail } = after as ProductDetailEntity;

        await this.catalog_query_repository.update(product_id, { detail });
        break;
      }

      case "product_categories": {
        const { product_id, category_id, is_primary } = after as ProductCategoryEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });

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

        await this.catalog_query_repository.update(product_id, {
          categories: updated_categories,
        });
        break;
      }

      case "product_prices": {
        const { product_id, ...price } = after as ProductPriceEntity;

        const discount_percentage =
          ((price.base_price - (price.sale_price ?? 0)) * 100) / price.base_price;

        await this.catalog_query_repository.update(product_id, {
          price: { ...price, discount_percentage },
        });
        await this.summary_query_repository.update(product_id, price);
        break;
      }

      case "product_option_groups": {
        const { id: option_group_id, product_id, ...rest } = after as ProductOptionGroupEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const option_groups = catalog?.option_groups ?? [];

        const exists = option_groups.some((group) => group.id === option_group_id);
        const updated_option_groups = exists
          ? option_groups.map((group) =>
              group.id === option_group_id ? { ...group, ...rest } : group,
            )
          : [...option_groups, { id: option_group_id, options: [], ...rest }];

        await this.catalog_query_repository.update(product_id, {
          option_groups: updated_option_groups,
        });
        break;
      }

      case "product_tags": {
        const { product_id, tag_id } = after as ProductTagEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });

        const tag = await this.tag_state_repository.findOneBy({ id: tag_id });

        const updated_tags = [...(catalog?.tags ?? []).filter((t) => t?.id !== tag_id), tag];

        await this.catalog_query_repository.update(product_id, { tags: updated_tags });
        break;
      }
    }
  }
}
