import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { BrowsingService } from "@browsing/application/services";
import { CategoryCatalogView, ProductSummaryView } from "@browsing/infrastructure/views";
import { MainResponseBundleDTO, ResponseDTO } from "../dto";
import MainController from "./Main.controller";

describe("MainController", () => {
  let controller: MainController;
  let service: BrowsingService;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    controller = module.get(MainController);
    service = module.get(BrowsingService);
  });

  describe("getMainProducts", () => {
    it("메인 페이지용 상품 목록 조회 성공", async () => {
      const mockNewProducts = [{ id: 1, name: "새 상품" }] as ProductSummaryView[];
      const mockPopularProducts = [{ id: 2, name: "인기 상품" }] as ProductSummaryView[];
      const mockFeaturedCategories = [{ id: 3, name: "추천 카테고리" }] as CategoryCatalogView[];

      service.find = jest.fn().mockResolvedValue({
        new_products: mockNewProducts,
        popular_products: mockPopularProducts,
        featured_categories: mockFeaturedCategories,
      });

      const result: ResponseDTO<MainResponseBundleDTO> = await controller.read_main_products();

      expect(service.find).toHaveBeenCalled();
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
