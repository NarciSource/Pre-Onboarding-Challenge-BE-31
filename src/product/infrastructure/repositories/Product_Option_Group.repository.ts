import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductOptionGroupEntity } from "../entities";

@Injectable()
export default class ProductOptionGroupRepository extends BaseRepository<ProductOptionGroupEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async saves(option_groups: ProductOptionGroupEntity[]) {
    return await this.entity_manager.save(ProductOptionGroupEntity, option_groups);
  }
}
