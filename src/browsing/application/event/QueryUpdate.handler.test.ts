import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IQueryRepository, IViewRepository } from "@shared/repositories";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/rdb/views";
import QueryUpdateEvent from "./QueryUpdate.event";
import QueryUpdateHandler from "./QueryUpdate.handler";

describe("QueryUpdateHandler", () => {
  let handler: QueryUpdateHandler;
  let catalogViewRepo: IViewRepository<ProductCatalogView>;
  let summaryViewRepo: IViewRepository<ProductSummaryView>;
  let catalogQueryRepo: IQueryRepository<ProductCatalogModel>;
  let summaryQueryRepo: IQueryRepository<ProductSummaryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(QueryUpdateHandler);

    catalogViewRepo = module.get("IProductCatalogViewRepository");
    summaryViewRepo = module.get("IProductSummaryViewRepository");
    catalogQueryRepo = module.get("IProductCatalogQueryRepository");
    summaryQueryRepo = module.get("IProductSummaryQueryRepository");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("정상적으로 카탈로그와 요약 정보를 업데이트한다", async () => {
    const id = 1;
    const catalog = { id, name: "카탈로그" } as ProductCatalogView;
    const summary = { id, name: "요약" } as ProductSummaryView;

    catalogViewRepo.findOneBy = jest.fn().mockResolvedValue(catalog);
    summaryViewRepo.findOneBy = jest.fn().mockResolvedValue(summary);
    catalogQueryRepo.update = jest.fn().mockResolvedValue(undefined);
    summaryQueryRepo.update = jest.fn().mockResolvedValue(undefined);

    const event = new QueryUpdateEvent(id);
    const promise = handler.handle(event);

    await expect(promise).resolves.toBeUndefined();

    expect(catalogViewRepo.findOneBy).toHaveBeenCalledWith({ id });
    expect(catalogQueryRepo.update).toHaveBeenCalledWith(id, catalog);
    expect(summaryViewRepo.findOneBy).toHaveBeenCalledWith({ id });
    expect(summaryQueryRepo.update).toHaveBeenCalledWith(id, summary);
  });

  it("카탈로그가 없으면 NotFoundException을 던진다", async () => {
    const id = 2;
    catalogViewRepo.findOneBy = jest.fn().mockResolvedValue(null);

    const event = new QueryUpdateEvent(id);
    const promise = handler.handle(event);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(catalogViewRepo.findOneBy).toHaveBeenCalledWith({ id });
    expect(catalogQueryRepo.update).not.toHaveBeenCalled();
    expect(summaryViewRepo.findOneBy).not.toHaveBeenCalled();
    expect(summaryQueryRepo.update).not.toHaveBeenCalled();
  });

  it("요약 정보가 없으면 NotFoundException을 던진다", async () => {
    const id = 3;
    const catalog = { id, name: "카탈로그" } as ProductCatalogView;

    catalogViewRepo.findOneBy = jest.fn().mockResolvedValue(catalog);
    catalogQueryRepo.update = jest.fn().mockResolvedValue(undefined);
    summaryViewRepo.findOneBy = jest.fn().mockResolvedValue(null);

    const event = new QueryUpdateEvent(id);
    const promise = handler.handle(event);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(catalogViewRepo.findOneBy).toHaveBeenCalledWith({ id });
    expect(catalogQueryRepo.update).toHaveBeenCalledWith(id, catalog);
    expect(summaryViewRepo.findOneBy).toHaveBeenCalledWith({ id });
    expect(summaryQueryRepo.update).not.toHaveBeenCalled();
  });
});
