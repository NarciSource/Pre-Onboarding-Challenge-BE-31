import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import { IQueryRepository } from "query/domain/repositories";
import { ReviewEntity } from "query/rdb/entities";

import ReviewUpdateEvent from "./ReviewUpdate.event";

@EventsHandler(ReviewUpdateEvent)
export default class ReviewUpdateHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ before, after }: ReviewUpdateEvent) {
    const { rating: before_rating } = before as ReviewEntity;
    const { product_id, rating: after_rating } = after as ReviewEntity;

    const product = await this.catalog_query_repository.findOne({ id: product_id });
    if (!product) return;

    const { average, count, distribution } = product.rating ?? {
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    const updated_average = (average * count + after_rating - before_rating) / count;
    distribution[before_rating] -= 1;
    distribution[after_rating] += 1;

    await this.catalog_query_repository.updateOne(
      { id: product_id },
      { rating: { average: updated_average, count, distribution } },
      { upsert: true },
    );

    await this.summary_query_repository.updateOne(
      { id: product_id },
      { rating: updated_average },
      { upsert: true },
    );
  }
}
