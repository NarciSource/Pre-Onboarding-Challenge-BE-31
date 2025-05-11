import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { CategoryService } from "@category/application/services";
import { CategoryQueryDTO } from "../dto";
import CategoryController from "./Category.controller";

describe("CategoryController", () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    controller = module.get(CategoryController);
    service = module.get(CategoryService);
  });

  describe("readCategories", () => {
    it("카테고리 목록 조회 성공", async () => {
      const level = 2;
      const data = [{ id: 1, name: "Category 1" }];
      service.find_all_as_tree = jest.fn().mockResolvedValue(data);

      const result = await controller.read_categories({ level });

      expect(service.find_all_as_tree).toHaveBeenCalledWith(level);
      expect(result).toEqual({
        success: true,
        data,
        message: "카테고리 목록을 성공적으로 조회했습니다.",
      });
    });
  });

  describe("readProducts", () => {
    it("특정 카테고리의 상품 목록 조회 성공", async () => {
      const id = 1;
      const query = { page: 1, perPage: 10 } as CategoryQueryDTO;
      const data = { category: "Category 1" };
      service.find_products_by_category_id = jest.fn().mockResolvedValue(data);

      const result = await controller.read_products({ id }, query);

      expect(service.find_products_by_category_id).toHaveBeenCalledWith(id, query);
      expect(result).toEqual({
        success: true,
        data,
        message: "카테고리 상품 목록을 성공적으로 조회했습니다.",
      });
    });
  });
});
