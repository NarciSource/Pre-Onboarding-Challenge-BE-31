import { TestingModule } from "@nestjs/testing";

import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import ProductDeleteEvent from "./ProductDelete.event";
import ProductDeleteHandler from "./ProductDelete.handler";

describe("ProductDeleteHandler", () => {
  let handler: ProductDeleteHandler;

  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ProductDeleteHandler);

    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    catalog_query_repository.delete = jest.fn();
    summary_query_repository.delete = jest.fn();
  });

  it("Catalog와 Summary에서 삭제", async () => {
    const event = { before: { id: 1 } } as ProductDeleteEvent;

    await handler.handle(event);

    expect(catalog_query_repository.delete).toHaveBeenCalledWith({ id: event.before.id });
    expect(summary_query_repository.delete).toHaveBeenCalledWith({ id: event.before.id });
  });
});
