import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductPriceEntity } from "../entities";

@Injectable()
export default class ProductPriceRepository extends BaseRepository<ProductPriceEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async save(price: ProductPriceEntity) {
    return await this.entity_manager.save(ProductPriceEntity, price);
  }

  async update(price: ProductPriceEntity, product_id: number) {
    const { affected } = await this.entity_manager.update(
      ProductPriceEntity,
      { product: { id: product_id } },
      price,
    );
    return !!affected;
  }
}
