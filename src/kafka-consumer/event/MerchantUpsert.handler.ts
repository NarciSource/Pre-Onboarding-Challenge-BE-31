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

        await this.catalog_query_repository.updateMany(
          { brand: { id: brand_id } },
          { brand: { id: brand_id, name, description, logo_url, website } },
        );

        await this.summary_query_repository.updateMany(
          { brand: { id: brand_id } },
          { brand: { id: brand_id, name } },
        );
        break;
      }

      case "sellers": {
        const { id, name, description, logo_url, rating, contact_email, contact_phone } =
          after as SellerEntity;

        await this.catalog_query_repository.updateMany(
          { seller: { id } },
          { seller: { id, name, description, logo_url, rating, contact_email, contact_phone } },
        );

        await this.summary_query_repository.updateMany(
          { seller: { id } },
          { seller: { id, name } },
        );
        break;
      }
    }
  }
}
