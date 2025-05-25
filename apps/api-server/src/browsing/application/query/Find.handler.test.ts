import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IQueryRepository } from "@libs/domain/repository";
import { FeaturedCategoryModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import FindHandler from "./Find.handler";

describe("FindHandler", () => {
  let handler: FindHandler;
  let productSummaryRepository: IQueryRepository<ProductSummaryModel>;
  let categoryCatalogRepository: IQueryRepository<FeaturedCategoryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<FindHandler>(FindHandler);

    productSummaryRepository = module.get("IProductSummaryQueryRepository");
    categoryCatalogRepository = module.get("IFeaturedCategoryQueryRepository");
  });

  it("신상품, 인기상품, 추천 카테고리 조회", async () => {
    const mockNewProducts = [
      { id: 1, name: "신상품1" },
      { id: 2, name: "신상품2" },
    ];
    const mockPopularProducts = [
      { id: 3, name: "인기상품1" },
      { id: 4, name: "인기상품2" },
    ];
    const mockFeaturedCategories = [
      { id: 1, name: "카테고리1", product_count: 100 },
      { id: 2, name: "카테고리2", product_count: 80 },
    ];

    productSummaryRepository.find = jest
      .fn()
      .mockResolvedValueOnce(mockNewProducts)
      .mockResolvedValueOnce(mockPopularProducts);
    categoryCatalogRepository.find = jest.fn().mockResolvedValue(mockFeaturedCategories);

    const result = await handler.execute();

    expect(result).toEqual({
      new_products: mockNewProducts,
      popular_products: mockPopularProducts,
      featured_categories: mockFeaturedCategories,
    });

    expect(productSummaryRepository.find).toHaveBeenCalledWith({
      order: { created_at: "DESC" },
    });
    expect(productSummaryRepository.find).toHaveBeenCalledWith({
      order: { rating: "DESC" },
    });
    expect(categoryCatalogRepository.find).toHaveBeenCalledWith({
      order: { product_count: "DESC" },
      take: 5,
    });
  });
});
