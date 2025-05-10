import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductEntity } from "../entities";

@Injectable()
export default class ProductRepository extends BaseRepository<ProductEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    return this.entity_manager.save(ProductEntity, product);
  }

  async update(product: ProductEntity, id: number) {
    const { affected } = await this.entity_manager.update(ProductEntity, { id }, product);
    return !!affected;
  }

  async delete(id: number) {
    const { affected } = await this.entity_manager.delete(ProductEntity, id);
    return !!affected;
  }
}
