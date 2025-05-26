import { TestingModule } from "@nestjs/testing";

import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import MerchantUpsertEvent from "./MerchantUpsert.event";
import MerchantUpsertHandler from "./MerchantUpsert.handler";

describe("MerchantUpsertHandler", () => {
  let handler: MerchantUpsertHandler;

  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(MerchantUpsertHandler);

    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    catalog_query_repository.update = jest.fn();
    summary_query_repository.update = jest.fn();
  });

  it("brands 테이블 이벤트 처리", async () => {
    const event = {
      table: "brands",
      after: { id: 1 },
    } as MerchantUpsertEvent;

    await handler.handle(event);

    expect(catalog_query_repository.update).toHaveBeenCalled();
    expect(summary_query_repository.update).toHaveBeenCalled();
  });

  it("sellers 테이블 이벤트 처리", async () => {
    const event = {
      table: "sellers",
      after: { id: 2 },
    } as MerchantUpsertEvent;

    await handler.handle(event);

    expect(catalog_query_repository.update).toHaveBeenCalled();
    expect(summary_query_repository.update).toHaveBeenCalled();
  });

  it("알 수 없는 테이블은 아무 동작도 하지 않음", async () => {
    const event = {
      table: "unknown",
      after: {},
    } as unknown as MerchantUpsertEvent;

    await handler.handle(event);

    expect(catalog_query_repository.update).not.toHaveBeenCalled();
    expect(summary_query_repository.update).not.toHaveBeenCalled();
  });
});
