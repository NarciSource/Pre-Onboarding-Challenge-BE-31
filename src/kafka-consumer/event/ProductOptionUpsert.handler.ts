import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@shared/repositories";
import { ProductImageEntity, ProductOptionEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import ProductOptionUpsertEvent from "./ProductOptionUpsert.event";

@EventsHandler(ProductOptionUpsertEvent)
export default class ProductOptionUpsertHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ table, after }: ProductOptionUpsertEvent) {
    switch (table) {
      case "product_options": {
        const { id, option_group_id, ...rest } = after as ProductOptionEntity;

        const catalog = await this.catalog_query_repository.findOneBy({
          option_groups: { id: option_group_id },
        });
        if (!catalog) return; // lazy update

        const option_groups = catalog.option_groups.map((group) =>
          group.id === option_group_id
            ? {
                ...group,
                options: [...group.options.filter((option) => option.id !== id), { id, ...rest }],
              }
            : group,
        );

        await this.catalog_query_repository.update(catalog.id, { option_groups });
        break;
      }

      case "product_images": {
        const { id, product_id, ...rest } = after as ProductImageEntity;
        {
          const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });

          const images = [
            ...(catalog?.images?.filter((image) => image.id !== id) ?? []),
            { id, ...rest },
          ];

          await this.catalog_query_repository.update(product_id, { images });
        }
        {
          if (!rest.is_primary) break;

          const primary_image = { url: rest.url, alt_text: rest.alt_text };

          await this.summary_query_repository.update(product_id, { primary_image });
        }
        break;
      }
    }
  }
}
