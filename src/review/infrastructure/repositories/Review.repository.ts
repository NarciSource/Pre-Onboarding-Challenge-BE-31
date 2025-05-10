import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { BaseRepository } from "@shared/repositories";
import { ReviewEntity } from "../entities";

@Injectable()
export default class ReviewRepository extends BaseRepository<ReviewEntity> {
  constructor(protected readonly entity_manager: EntityManager) {
    super(entity_manager);
  }

  async save(review: ReviewEntity): Promise<ReviewEntity> {
    return this.entity_manager.save(ReviewEntity, review);
  }

  async find_by_filters({
    product_id,
    page = 1,
    per_page = 10,
    sort_field,
    sort_order = "DESC",
    rating,
  }: {
    product_id: number;
    page?: number;
    per_page?: number;
    sort_field?: string;
    sort_order?: string;
    rating?: number;
  }): Promise<ReviewEntity[]> {
    const query = this.entity_manager
      .getRepository(ReviewEntity)
      .createQueryBuilder("reviews")
      .leftJoinAndSelect("reviews.user", "user")
      .where("1 = 1")
      .andWhere("reviews.product_id = :product_id", { product_id })
      .andWhere(rating ? "reviews.rating = :rating" : "1=1", { rating })
      .orderBy(`reviews.${sort_field}`, sort_order.toUpperCase() as "ASC" | "DESC")
      .skip((page - 1) * per_page)
      .take(per_page);

    return await query.getMany();
  }

  async update(review: ReviewEntity, id: number) {
    const { affected } = await this.entity_manager.update(ReviewEntity, id, review);
    return !!affected;
  }

  async delete(id: number) {
    const { affected } = await this.entity_manager.delete(ReviewEntity, id);
    return !!affected;
  }
}
