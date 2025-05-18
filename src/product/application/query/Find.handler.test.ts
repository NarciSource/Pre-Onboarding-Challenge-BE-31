import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IQueryRepository } from "@shared/repositories";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import FindHandler from "./Find.handler";

describe("FindHandler", () => {
  let handler: FindHandler;
  let catalogRepository: IQueryRepository<ProductCatalogModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<FindHandler>(FindHandler);

    catalogRepository = module.get("IProductCatalogQueryRepository");
  });

  it("상품 조회", async () => {
    const product = { id: 1, name: "상품명" };
    catalogRepository.findOneBy = jest.fn().mockResolvedValue(product);

    const result = await handler.execute({ id: 1 });

    expect(result).toEqual(product);
    expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("상품 조회 실패 시 NotFoundException 발생", async () => {
    catalogRepository.findOneBy = jest.fn().mockResolvedValue(null);

    const findPromise = handler.execute({ id: 1 });

    await expect(findPromise).rejects.toThrow(NotFoundException);
    expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
});
