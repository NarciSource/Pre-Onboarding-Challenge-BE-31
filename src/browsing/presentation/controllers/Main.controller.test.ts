import { QueryBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { CategoryCatalogView, ProductSummaryView } from "@browsing/infrastructure/rdb/views";
import { MainResponseBundleDTO, ResponseDTO } from "../dto";
import MainController from "./Main.controller";

describe("MainController", () => {
  let controller: MainController;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    controller = module.get(MainController);
    queryBus = module.get(QueryBus);
  });

  describe("getMainProducts", () => {
    it("메인 페이지용 상품 목록 조회 성공", async () => {
      const mockNewProducts = [{ id: 1, name: "새 상품" }] as ProductSummaryView[];
      const mockPopularProducts = [{ id: 2, name: "인기 상품" }] as ProductSummaryView[];
      const mockFeaturedCategories = [{ id: 3, name: "추천 카테고리" }] as CategoryCatalogView[];

      queryBus.execute = jest.fn().mockResolvedValue({
        new_products: mockNewProducts,
        popular_products: mockPopularProducts,
        featured_categories: mockFeaturedCategories,
      });

      const result: ResponseDTO<MainResponseBundleDTO> = await controller.read_main_products();

      expect(queryBus.execute).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        data: {
          new_products: mockNewProducts,
          popular_products: mockPopularProducts,
          featured_categories: mockFeaturedCategories,
        },
        message: "메인 페이지 상품 목록을 성공적으로 조회했습니다.",
      });
    });
  });
});
