import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductTagEntity } from "../entities";

@Injectable()
export default class ProductTagRepository extends BaseRepository<ProductTagEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async saves(product_tags: ProductTagEntity[]) {
    return await this.entity_manager.save(ProductTagEntity, product_tags);
  }
}
