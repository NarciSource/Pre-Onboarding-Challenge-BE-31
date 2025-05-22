import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IBaseRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import FindQuery from "./Find.query";

@QueryHandler(FindQuery)
export default class FindHandler implements IQueryHandler<FindQuery> {
  constructor(
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
  ) {}

  async execute({ product_id, dto: { page = 1, per_page = 10, sort, rating } }: FindQuery) {
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
}
