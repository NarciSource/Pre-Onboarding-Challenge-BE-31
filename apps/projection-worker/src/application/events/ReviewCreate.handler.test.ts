import { TestingModule } from "@nestjs/testing";

import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import ReviewCreateEvent from "./ReviewCreate.event";
import ReviewCreateHandler from "./ReviewCreate.handler";

describe("ReviewCreateHandler", () => {
  let handler: ReviewCreateHandler;
  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ReviewCreateHandler);
    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    catalog_query_repository.updateOne = jest.fn();
    catalog_query_repository.findOne = jest.fn();
    summary_query_repository.updateOne = jest.fn();
    summary_query_repository.findOne = jest.fn();
  });

  it("리뷰 생성 시 catalog의 rating을 올바르게 갱신", async () => {
    const product_id = 1;
    const rating = 4;
    const event = { after: { product_id, rating } } as ReviewCreateEvent;

    const catalog = {
      id: product_id,
      rating: {
        average: 3,
        count: 2,
        distribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 0 },
      },
    } as ProductCatalogModel;

    catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

    await handler.handle(event);

    expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
      { id: product_id },
      {
        rating: {
          average: (3 * 2 + 4) / 3,
          count: 3,
          distribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 0 },
        },
      },
      { upsert: true },
    );
    expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
      { id: product_id },
      { rating: (3 * 2 + 4) / 3 },
      { upsert: true },
    );
  });

  it("catalog에 rating 정보가 없으면 기본값으로 갱신", async () => {
    const product_id = 2;
    const rating = 5;
    const event = { after: { product_id, rating } } as ReviewCreateEvent;

    const catalog = {
      id: product_id,
      // rating 없음
    } as ProductCatalogModel;

    catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

    await handler.handle(event);

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
});
