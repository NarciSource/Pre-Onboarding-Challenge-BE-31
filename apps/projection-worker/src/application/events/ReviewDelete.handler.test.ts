import { TestingModule } from "@nestjs/testing";

import { Review } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import ReviewDeleteEvent from "./ReviewDelete.event";
import ReviewDeleteHandler from "./ReviewDelete.handler";

describe("ReviewDeleteHandler", () => {
  let handler: ReviewDeleteHandler;
  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ReviewDeleteHandler);
    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    catalog_query_repository.updateOne = jest.fn();
    catalog_query_repository.findOne = jest.fn();
    summary_query_repository.updateOne = jest.fn();
    summary_query_repository.findOne = jest.fn();
  });

  it("리뷰 삭제 시 catalog와 summary의 평점 정보 갱신", async () => {
    const product_id = 1;
    const rating = 4;
    const before = { product_id, rating } as Review;
    const event = { before } as ReviewDeleteEvent;

    const catalog = {
      id: product_id,
      rating: {
        average: 4.5,
        count: 2,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
      },
    } as ProductCatalogModel;

    catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

    await handler.handle(event);

    // (4.5 * 2 - 4) / (2 - 1) = (9 - 4) / 1 = 5
    expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
      { id: product_id },
      {
        rating: {
          average: 5,
          count: 1,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
        },
      },
      { upsert: true },
    );
    expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
      { id: product_id },
      { rating: 5 },
      { upsert: true },
    );
  });

  it("rating 정보가 없는 경우 기본값으로 동작", async () => {
    const product_id = 2;
    const rating = 3;
    const before = { product_id, rating } as Review;
    const event = { before } as ReviewDeleteEvent;

    const catalog = {
      id: product_id,
      // rating이 undefined
    } as ProductCatalogModel;

    catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

    await handler.handle(event);

    // (0 * 0 - 3) / (0 - 1) = -3 / -1 = 3
    expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
      { id: product_id },
      {
        rating: {
          average: 3,
          count: -1,
          distribution: { 1: 0, 2: 0, 3: -1, 4: 0, 5: 0 },
        },
      },
      { upsert: true },
    );
    expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
      { id: product_id },
      { rating: 3 },
      { upsert: true },
    );
  });
});
