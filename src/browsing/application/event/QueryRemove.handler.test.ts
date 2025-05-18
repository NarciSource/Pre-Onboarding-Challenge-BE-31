import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IQueryRepository } from "@shared/repositories";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import QueryRemoveEvent from "./QueryRemove.event";
import QueryRemoveHandler from "./QueryRemove.handler";

describe("QueryRemoveHandler", () => {
  let handler: QueryRemoveHandler;
  let catalogRepository: IQueryRepository<ProductCatalogModel>;
  let summaryRepository: IQueryRepository<ProductSummaryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(QueryRemoveHandler);

    catalogRepository = module.get("IProductCatalogQueryRepository");
    summaryRepository = module.get("IProductSummaryQueryRepository");
  });

  it("id로 카탈로그와 요약을 삭제한다", async () => {
    const id = 1;
    catalogRepository.delete = jest.fn().mockResolvedValue(undefined);
    summaryRepository.delete = jest.fn().mockResolvedValue(undefined);

    const event = new QueryRemoveEvent(id);
    await handler.handle(event);

    expect(catalogRepository.delete).toHaveBeenCalledWith(id);
    expect(summaryRepository.delete).toHaveBeenCalledWith(id);
  });

  it("카탈로그 삭제 중 에러 발생 시 예외를 던진다", async () => {
    catalogRepository.delete = jest.fn().mockRejectedValue(new Error("삭제 실패"));
    summaryRepository.delete = jest.fn();

    const event = new QueryRemoveEvent(1);
    const promise = handler.handle(event);

    await expect(promise).rejects.toThrow("삭제 실패");
  });

  it("요약 삭제 중 에러 발생 시 예외를 던진다", async () => {
    catalogRepository.delete = jest.fn().mockResolvedValue(undefined);
    summaryRepository.delete = jest.fn().mockRejectedValue(new Error("요약 삭제 실패"));

    const event = new QueryRemoveEvent(1);
    const promise = handler.handle(event);

    await expect(promise).rejects.toThrow("요약 삭제 실패");
  });
});
