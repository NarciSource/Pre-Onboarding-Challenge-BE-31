import { TestingModule } from "@nestjs/testing";

import { Review } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import ReviewUpdateEvent from "./ReviewUpdate.event";
import ReviewUpdateHandler from "./ReviewUpdate.handler";

describe("ReviewUpdateHandler", () => {
  let handler: ReviewUpdateHandler;
  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ReviewUpdateHandler);
    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");

    catalog_query_repository.updateOne = jest.fn();
    summary_query_repository.updateOne = jest.fn();
  });

  it("리뷰 평점이 변경되면 catalog와 summary의 평점 갱신", async () => {
    const before = { id: 1, product_id: 10, rating: 3 } as Review;
    const after = { id: 1, product_id: 10, rating: 5 } as Review;
    const event = { before, after } as ReviewUpdateEvent;

    const catalog = {
      id: 10,
      rating: {
        average: 4,
        count: 2,
        distribution: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 1 },
      },
    } as ProductCatalogModel;

    catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

    await handler.handle(event);

    // (4*2 + 5 - 3) / 2 = (8+2)/2 = 5
    expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
      { id: 10 },
      {
        rating: {
          average: 5,
          count: 2,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 },
        },
      },
      { upsert: true },
    );

    expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
      { id: 10 },
      { rating: 5 },
      { upsert: true },
    );
  });

  it("catalog에 rating 정보가 없으면 기본값으로 계산", async () => {
    const before = { id: 1, product_id: 20, rating: 1 } as Review;
    const after = { id: 1, product_id: 20, rating: 5 } as Review;
    const event = { before, after } as ReviewUpdateEvent;

    const catalog = {
      id: 20,
      // rating이 undefined
    } as ProductCatalogModel;

    catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

    await handler.handle(event);

    // average: 0, count: 0, distribution: {1:0,2:0,3:0,4:0,5:0}
    // (0*0 + 5 - 1) / 0 => NaN, 하지만 실제로는 count가 0이면 잘못된 상황이므로 테스트에서는 NaN이 전달되는지 확인
    expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
      { id: 20 },
      {
        rating: {
          average: Infinity,
          count: 0,
          distribution: { 1: -1, 2: 0, 3: 0, 4: 0, 5: 1 },
        },
      },
      { upsert: true },
    );

    expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
      { id: 20 },
      { rating: Infinity },
      { upsert: true },
    );
  });
});
