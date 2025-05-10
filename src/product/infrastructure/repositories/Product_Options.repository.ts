import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductOptionEntity } from "../entities";

@Injectable()
export default class ProductOptionsRepository extends BaseRepository<ProductOptionEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async save(option: ProductOptionEntity) {
    return this.entity_manager.save(option);
  }

  async saves(options: ProductOptionEntity[]) {
    return this.entity_manager.save(ProductOptionEntity, options);
  }

  async update(option: ProductOptionEntity, option_id: number) {
    const { affected } = await this.entity_manager.update(
      ProductOptionEntity,
      { id: option_id },
      option,
    );
    return !!affected;
  }

  async delete(id: number) {
    const { affected } = await this.entity_manager.delete(ProductOptionEntity, id);
    return !!affected;
  }
}
