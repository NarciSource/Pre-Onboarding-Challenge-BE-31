import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@query/domain/repositories";
import { ProductCatalogModel, ProductSummaryModel } from "@query/mongo/models";
import { BrandEntity, SellerEntity } from "@query/rdb/entities";

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
        const { id, name, description, logo_url, website } = after as BrandEntity;

        await this.catalog_query_repository.update(
          { brand: { id } },
          { brand: { id, name, description, logo_url, website } },
        );

        await this.summary_query_repository.update({ brand: { id } }, { brand: { id, name } });
        break;
      }

      case "sellers": {
        const { id, name, description, logo_url, rating, contact_email, contact_phone } =
          after as SellerEntity;

        await this.catalog_query_repository.update(
          { seller: { id } },
          { seller: { id, name, description, logo_url, rating, contact_email, contact_phone } },
        );

        await this.summary_query_repository.update({ seller: { id } }, { seller: { id, name } });
        break;
      }
    }
  }
}
