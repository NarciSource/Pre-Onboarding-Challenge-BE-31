import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { Review } from "@review/domain/entities";
import { ReviewEntity } from "@review/infrastructure/entities";
import { FilterDTO } from "../dto";

@Injectable()
export default class ReviewService {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
  ) {}

  async find(product_id: number, { page = 1, per_page = 10, sort, rating }: FilterDTO) {
    const [sort_field, sort_order] = sort?.split(":") ?? ["created_at", "DESC"];

    const reviews = await this.repository.find({
      where: {
        product: { id: product_id },
        rating,
      },
      relations: ["user"],
      order: { [sort_field]: sort_order.toUpperCase() as "ASC" | "DESC" },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const summary = {
      average:
        reviews.map((review) => review.rating).reduce((a, b) => a + b, 0) / reviews.length || 0,
      count: reviews.length,
      distribution: {
        1: reviews.filter((review) => review.rating === 1).length,
        2: reviews.filter((review) => review.rating === 2).length,
        3: reviews.filter((review) => review.rating === 3).length,
        4: reviews.filter((review) => review.rating === 4).length,
        5: reviews.filter((review) => review.rating === 5).length,
      },
    };

    return {
      items: reviews,
      summary,
      pagination: {
        total_items: reviews.length,
        total_pages: Math.ceil(reviews.length / per_page),
        current_page: page,
        per_page: per_page,
      },
    };
  }

  async register(product_id: number, review: Pick<Review, "rating" | "title" | "content">) {
    const created = await this.entity_manager.transaction(async (manager) => {
      const { id } = await this.repository
        .with_transaction(manager)
        .save({ product: { id: product_id }, ...review });

      return await this.repository
        .with_transaction(manager)
        .findOne({ where: { id }, relations: ["user"] });
    });

    return created!;
  }

  async edit(review_id: number, review: Pick<Review, "rating" | "title" | "content">) {
    const updated = await this.entity_manager.transaction(async (manager) => {
      const { affected } = await this.repository
        .with_transaction(manager)
        .update(review_id, review);

      if (!affected) {
        throw new NotFoundException({
          message: "요청한 리소스를 찾을 수 없습니다.",
          details: { resourceType: "Review", resourceId: review_id },
        });
      }

      return await this.repository.with_transaction(manager).findOneBy({ id: review_id });
    });

    const { id, rating, title, content, updated_at } = updated!;
    return { id, rating, title, content, updated_at };
  }

  async remove(id: number) {
    const { affected } = await this.repository.delete(id);

    if (!affected) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Review", resourceId: id },
      });
    }
  }
}
