import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ProductCategoryEntity } from "../entities";

@Injectable()
export default class ProductCategoryRepository extends BaseRepository<ProductCategoryEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async saves(categories: ProductCategoryEntity[]) {
    return await this.entity_manager.save(ProductCategoryEntity, categories);
  }

  async update({ id, is_primary }: ProductCategoryEntity, product_id: number) {
    const { affected } = await this.entity_manager.update(
      ProductCategoryEntity,
      { product: { id: product_id } },
      { is_primary, category: { id } },
    );
    return !!affected;
  }
}
