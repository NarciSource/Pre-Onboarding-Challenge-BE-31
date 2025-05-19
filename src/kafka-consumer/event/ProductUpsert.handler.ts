import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { TableEntity } from "@kafka-consumer/dto";
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
  ) {}

  async handle({ table, data }: ProductUpsertEvent<TableEntity>) {
    switch (table) {
      case "products": {
        const product = data as ProductEntity;

        await this.catalog_query_repository.update(product.id, product);
        await this.summary_query_repository.update(product.id, product);
        break;
      }
      case "product_details": {
        const { product_id, ...detail } = data as ProductDetailEntity;

        await this.catalog_query_repository.update(product_id, { detail });
        break;
      }
      case "product_categories": {
        const { product_id, category_id, is_primary } = data as ProductCategoryEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const categories = catalog?.categories ?? [];

        const updated_categories = [
          ...categories.filter((c) => c?.id !== category_id),
          { id: category_id, is_primary },
        ];

        await this.catalog_query_repository.update(product_id, {
          categories: updated_categories,
        });
        break;
      }
      case "product_prices": {
        const { product_id, ...price } = data as ProductPriceEntity;

        const discount_percentage =
          ((price.base_price - (price.sale_price ?? 0)) * 100) / price.base_price;

        await this.catalog_query_repository.update(product_id, {
          price: { ...price, discount_percentage },
        });
        await this.summary_query_repository.update(product_id, price);
        break;
      }
      case "product_option_groups": {
        const { id, product_id, name, display_order } = data as ProductOptionGroupEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const option_group = catalog?.option_groups ?? [];

        const updated_option_groups = [
          ...option_group.filter((og) => og?.id !== id),
          { id, name, display_order },
        ];

        await this.catalog_query_repository.update(product_id, {
          option_groups: updated_option_groups,
        });
        break;
      }
      case "product_tags": {
        const { product_id, tag_id } = data as ProductTagEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const tags = catalog?.tags ?? [];

        const updated_tags = [...tags.filter((t) => t?.id !== tag_id), { id: tag_id }];

        await this.catalog_query_repository.update(product_id, {
          tags: updated_tags,
        });
        break;
      }
    }
  }
}
