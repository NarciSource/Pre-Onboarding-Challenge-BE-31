import { TestingModule } from "@nestjs/testing";

import { Category } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import test_module from "../../__test-utils__/test-module";
import { CategoryStateModel } from "../../infrastructure/model";
import CategoryUpsertEvent from "./CategoryUpsert.event";
import CategoryUpsertHandler from "./CategoryUpsert.handler";

describe("CategoryUpsertHandler", () => {
  let handler: CategoryUpsertHandler;

  let repository: IQueryRepository<CategoryStateModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(CategoryUpsertHandler);

    repository = module.get("ICategoryStateRepository");
    repository.updateOne = jest.fn();
  });

  it("카테고리 수정", async () => {
    const category = { id: 1, name: "카테고리" } as Category;
    const event = { after: category } as CategoryUpsertEvent;

    await handler.handle(event);

    expect(repository.updateOne).toHaveBeenCalledWith({ id: category.id }, category, {
      upsert: true,
    });
  });
});
