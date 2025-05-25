import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@libs/domain/repository";
import { ProductEntity } from "@libs/infrastructure/rdb/entities";
import RemoveHandler from "./Remove.handler";

describe("RemoveHandler", () => {
  let handler: RemoveHandler;

  let repository: IBaseRepository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<RemoveHandler>(RemoveHandler);

    repository = module.get("IProductRepository");
  });

  it("상품 삭제", async () => {
    repository.delete = jest.fn().mockResolvedValue({ affected: 1 });
    await handler.execute({ id: 1 });

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("상품 삭제 실패 시 NotFoundException 발생", async () => {
    repository.delete = jest.fn().mockResolvedValue({ affected: 0 });

    const removePromise = handler.execute({ id: 1 });

    await expect(removePromise).rejects.toThrow(NotFoundException);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
