import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IQueryRepository, IViewRepository } from "@shared/repositories";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/rdb/views";
import QueryRegisterEvent from "./QueryRegister.event";
import QueryRegisterHandler from "./QueryRegister.handler";

describe("QueryRegisterHandler", () => {
  let handler: QueryRegisterHandler;

  let product_catalog_view_repository: IViewRepository<ProductCatalogView>;
  let product_summary_view_repository: IViewRepository<ProductSummaryView>;
  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(QueryRegisterHandler);

    product_catalog_view_repository = module.get("IProductCatalogViewRepository");
    product_summary_view_repository = module.get("IProductSummaryViewRepository");
    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
  });

  it("정상적으로 카탈로그와 요약 정보를 저장한다", async () => {
    const id = 1;
    const catalog = { id, name: "카탈로그" };
    const summary = { id, summary: "요약" };

    product_catalog_view_repository.findOneBy = jest.fn().mockResolvedValue(catalog);
    product_summary_view_repository.findOneBy = jest.fn().mockResolvedValue(summary);
    catalog_query_repository.save = jest.fn().mockResolvedValue(undefined);
    summary_query_repository.save = jest.fn().mockResolvedValue(undefined);

    const event = new QueryRegisterEvent(id);
    await handler.handle(event);

    expect(product_catalog_view_repository.findOneBy).toHaveBeenCalledWith({ id });
    expect(product_summary_view_repository.findOneBy).toHaveBeenCalledWith({ id });
    expect(catalog_query_repository.save).toHaveBeenCalledWith(catalog);
    expect(summary_query_repository.save).toHaveBeenCalledWith(summary);
  });

  it("카탈로그를 찾지 못하면 NotFoundException 발생", async () => {
    const id = 2;
    product_catalog_view_repository.findOneBy = jest.fn().mockResolvedValue(null);

    const event = new QueryRegisterEvent(id);
    const promise = handler.handle(event);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(product_catalog_view_repository.findOneBy).toHaveBeenCalledWith({ id });
  });

  it("요약 정보를 찾지 못하면 NotFoundException 발생", async () => {
    const id = 3;
    const catalog = { id, name: "카탈로그" };

    product_catalog_view_repository.findOneBy = jest.fn().mockResolvedValue(catalog);
    product_summary_view_repository.findOneBy = jest.fn().mockResolvedValue(null);

    const event = new QueryRegisterEvent(id);
    const promise = handler.handle(event);

    await expect(promise).rejects.toThrow(NotFoundException);
    expect(product_catalog_view_repository.findOneBy).toHaveBeenCalledWith({ id });
    expect(product_summary_view_repository.findOneBy).toHaveBeenCalledWith({ id });
  });
});
