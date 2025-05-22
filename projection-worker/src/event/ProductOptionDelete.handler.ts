import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@shared/repositories";
import { ProductImageEntity, ProductOptionEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import ProductOptionDeleteEvent from "./ProductOptionDelete.event";

@EventsHandler(ProductOptionDeleteEvent)
export default class ProductOptionDeleteHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ table, before, after }: ProductOptionDeleteEvent) {
    switch (table) {
      case "product_options": {
        const { option_group_id } = after as ProductOptionEntity;

        const catalog = await this.catalog_query_repository.findOne({
          option_groups: { id: option_group_id },
        });
        if (!catalog) return; // lazy update

        const option_groups = catalog?.option_groups.map((group) =>
          group.id === option_group_id
            ? {
                ...group,
                options: group.options.filter((option) => option.id !== after.id),
              }
            : group,
        );

        await this.catalog_query_repository.updateOne(
          { id: catalog.id },
          { option_groups },
          { upsert: true },
        );
        break;
      }

      case "product_images": {
        {
          const { id, product_id } = before as ProductImageEntity;

          const catalog = await this.catalog_query_repository.findOne({ id: product_id });

          const images = catalog?.images?.filter((image) => image.id !== id) ?? [];

          await this.catalog_query_repository.updateOne(
            { id: product_id },
            { images },
            { upsert: true },
          );
        }
        {
          const { product_id, is_primary } = before as ProductImageEntity;

          if (!is_primary) break;

          await this.summary_query_repository.updateOne(
            { id: product_id },
            { primary_image: null },
            { upsert: true },
          );
        }
      }
    }
  }
}
