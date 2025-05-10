import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductDetailEntity } from "../entities";

@Injectable()
export default class ProductDetailRepository extends BaseRepository<ProductDetailEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async save(detail: ProductDetailEntity) {
    return await this.entity_manager.save(ProductDetailEntity, detail);
  }

  async update(detail: ProductDetailEntity, product_id: number) {
    const { affected } = await this.entity_manager.update(
      ProductDetailEntity,
      { product: { id: product_id } },
      detail,
    );
    return !!affected;
  }
}
