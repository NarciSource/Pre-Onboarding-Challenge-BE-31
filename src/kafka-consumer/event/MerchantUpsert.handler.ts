import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@shared/repositories";
import { BrandEntity, SellerEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import MerchantUpsertEvent from "./MerchantUpsert.event";

@EventsHandler(MerchantUpsertEvent)
export default class MerchantUpsertHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ table, after }: MerchantUpsertEvent) {
    switch (table) {
      case "brands": {
        const { id: brand_id, name, description, logo_url, website } = after as BrandEntity;
        {
          const catalogs = await this.catalog_query_repository.find({
            where: { brand: { id: brand_id } },
          });

          for (const catalog of catalogs) {
            await this.catalog_query_repository.update(catalog.id, {
              brand: { id: brand_id, name, description, logo_url, website },
            });
          }
        }
        {
          const summaries = await this.summary_query_repository.find({
            where: { brand: { id: brand_id } },
          });

          for (const catalog of summaries) {
            await this.summary_query_repository.update(catalog.id, {
              brand: { id: brand_id, name },
            });
          }
        }
        break;
      }

      case "sellers": {
        const { id, name, description, logo_url, rating, contact_email, contact_phone } =
          after as SellerEntity;
        {
          const catalogs = await this.catalog_query_repository.find({
            where: { seller: { id } },
          });

          for (const catalog of catalogs) {
            await this.catalog_query_repository.update(catalog.id, {
              seller: { id, name, description, logo_url, rating, contact_email, contact_phone },
            });
          }
        }
        {
          const summaries = await this.summary_query_repository.find({
            where: { seller: { id } },
          });

          for (const summary of summaries) {
            await this.summary_query_repository.update(summary.id, {
              seller: { id, name },
            });
          }
        }
        break;
      }
    }
  }
}
