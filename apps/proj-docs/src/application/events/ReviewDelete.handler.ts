import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { Review } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import ReviewDeleteEvent from "./ReviewDelete.event";

@EventsHandler(ReviewDeleteEvent)
export default class ReviewDeleteHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ before }: ReviewDeleteEvent) {
    const { product_id, rating } = before as Review;

    const product = await this.catalog_query_repository.findOne({ id: product_id });
    if (!product) return;

    const { average, count, distribution } = product.rating ?? {
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    const updated_count = count - 1;
    const updated_average = (average * count - rating) / updated_count;
    distribution[rating] -= 1;

    await this.catalog_query_repository.updateOne(
      { id: product_id },
      { rating: { average: updated_average, count: updated_count, distribution } },
      { upsert: true },
    );

    await this.summary_query_repository.updateOne(
      { id: product_id },
      { rating: updated_average },
      { upsert: true },
    );
  }
}
