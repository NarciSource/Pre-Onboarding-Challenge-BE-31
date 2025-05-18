import { QueryBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { CategoryQueryDTO } from "../dto";
import CategoryController from "./Category.controller";

describe("CategoryController", () => {
  let controller: CategoryController;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    controller = module.get(CategoryController);
    queryBus = module.get(QueryBus);
  });

  describe("readCategories", () => {
    it("카테고리 목록 조회 성공", async () => {
      const level = 2;
      const data = [{ id: 1, name: "Category 1" }];
      queryBus.execute = jest.fn().mockResolvedValue(data);

      const result = await controller.read_categories({ level });

      expect(queryBus.execute).toHaveBeenCalledWith({ level });
      expect(result).toEqual({
        success: true,
        data,
        message: "카테고리 목록을 성공적으로 조회했습니다.",
      });
    });
  });

  describe("readProducts", () => {
    it("특정 카테고리의 상품 목록 조회 성공", async () => {
      const category_id = 1;
      const dto = { page: 1, perPage: 10 } as CategoryQueryDTO;
      const data = { category: "Category 1" };
      queryBus.execute = jest.fn().mockResolvedValue(data);

      const result = await controller.read_products({ id: category_id }, dto);

      expect(queryBus.execute).toHaveBeenCalledWith({ category_id, dto });
      expect(result).toEqual({
        success: true,
        data,
        message: "카테고리 상품 목록을 성공적으로 조회했습니다.",
      });
    });
  });
});
