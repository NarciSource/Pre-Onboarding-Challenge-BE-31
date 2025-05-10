import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductImageEntity } from "../entities";

@Injectable()
export default class ProductImageRepository extends BaseRepository<ProductImageEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async save(image: ProductImageEntity) {
    return await this.entity_manager.save(ProductImageEntity, image);
  }

  async saves(images: ProductImageEntity[]) {
    return await this.entity_manager.save(ProductImageEntity, images);
  }
}
