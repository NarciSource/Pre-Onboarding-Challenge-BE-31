import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { Brand, Seller } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";

import { BrandStateModel, SellerStateModel } from "../../infrastructure/model";
import MerchantUpsertEvent from "./MerchantUpsert.event";

@EventsHandler(MerchantUpsertEvent)
export default class MerchantUpsertHandler {
  constructor(
    @Inject("IBrandStateRepository")
    private readonly brand_state_repository: IQueryRepository<BrandStateModel>,
    @Inject("ISellerStateRepository")
    private readonly seller_state_repository: IQueryRepository<SellerStateModel>,
  ) {}

  async handle({ table, after }: MerchantUpsertEvent) {
    switch (table) {
      case "brands": {
        const brand = after as Brand;

        await this.brand_state_repository.updateOne({ id: brand.id }, brand, { upsert: true });

        break;
      }

      case "sellers": {
        const seller = after as Seller;

        await this.seller_state_repository.updateOne({ id: seller.id }, seller, { upsert: true });

        break;
      }
    }
  }
}
