import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@libs/domain/repository";
import { Category } from "category/domain/entities";
import { CategoryEntity } from "category/infrastructure/rdb/entities";
import FindAllHandler from "./FindAll.handler";

describe("FindAllQuery", () => {
  let handler: FindAllHandler;
  let categoryRepository: IBaseRepository<CategoryEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<FindAllHandler>(FindAllHandler);

    categoryRepository = module.get("ICategoryRepository");

    const categories = [
      { id: 1, name: "대분류1", parent: null },
      { id: 2, name: "중분류1", parent: { id: 1 } as Category },
      { id: 3, name: "소분류1", parent: { id: 2 } as Category },
    ] as Category[];
    categoryRepository.find = jest.fn().mockResolvedValue(categories);
  });

  it("카테고리를 트리 구조로 반환 (레벨 1)", async () => {
    const result = await handler.execute({ level: 1 });

    expect(result).toEqual([
      {
        id: 1,
        name: "대분류1",
        children: [
          {
            id: 2,
            name: "중분류1",
            children: [
              {
                id: 3,
                name: "소분류1",
              },
            ],
          },
        ],
      },
    ]);
    expect(categoryRepository.find).toHaveBeenCalledWith({
      relations: ["parent"],
    });
  });

  it("카테고리를 트리 구조로 반환 (레벨 2)", async () => {
    const result = await handler.execute({ level: 2 });

    expect(result).toEqual([
      {
        id: 1,
        name: "대분류1",
        children: [
          {
            id: 2,
            name: "중분류1",
          },
        ],
      },
    ]);
  });

  it("카테고리를 트리 구조로 반환 (레벨 3)", async () => {
    const result = await handler.execute({ level: 3 });

    expect(result).toEqual([
      {
        id: 1,
        name: "대분류1",
      },
    ]);
  });

  it("레벨 제한을 초과한 경우 빈 배열 반환 (레벨 4)", async () => {
    const result = await handler.execute({ level: 4 });

    expect(result).toEqual([]);
  });
});
