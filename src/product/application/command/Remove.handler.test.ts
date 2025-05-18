import { NotFoundException } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/rdb/entities";
import { QueryRemoveEvent } from "@browsing/application/event";
import RemoveHandler from "./Remove.handler";

describe("RemoveHandler", () => {
  let handler: RemoveHandler;
  let event_bus: EventBus;

  let repository: IBaseRepository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<RemoveHandler>(RemoveHandler);
    event_bus = module.get(EventBus);

    repository = module.get("IProductRepository");
  });

  it("상품 삭제", async () => {
    repository.delete = jest.fn().mockResolvedValue({ affected: 1 });
    await handler.execute({ id: 1 });

    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(event_bus.publish).toHaveBeenCalledWith(expect.any(QueryRemoveEvent));
  });

  it("상품 삭제 실패 시 NotFoundException 발생", async () => {
    repository.delete = jest.fn().mockResolvedValue({ affected: 0 });

    const removePromise = handler.execute({ id: 1 });

    await expect(removePromise).rejects.toThrow(NotFoundException);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
