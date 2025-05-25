import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository, IQueryRepository } from "@libs/domain/repository";
import { ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import { Category } from "category/domain/entities";
import { CategoryEntity } from "category/infrastructure/rdb/entities";
import FindProductsHandler from "./FindProducts.handler";

describe("FindProductsHandler", () => {
  let handler: FindProductsHandler;
  let categoryRepository: IBaseRepository<CategoryEntity>;
  let productSummaryRepository: IQueryRepository<ProductSummaryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<FindProductsHandler>(FindProductsHandler);

    categoryRepository = module.get("ICategoryRepository");
    productSummaryRepository = module.get("IProductSummaryQueryRepository");
  });

  const category = { id: 1, name: "대분류1", parent: { id: 0 } } as Category;
  const items = [
    { id: 1, name: "상품1", created_at: new Date() },
    { id: 2, name: "상품2", created_at: new Date() },
  ];

  beforeEach(() => {
    categoryRepository.findOne = jest.fn().mockResolvedValue(category);
    productSummaryRepository.find = jest.fn().mockResolvedValue(items);
  });

  it("카테고리 ID로 상품 조회", async () => {
    const filter = { page: 1, per_page: 10, sort: "created_at:desc", has_sub: true };

    const result = await handler.execute({
      category_id: 1,
      dto: filter,
    });

    expect(result).toEqual({
      category,
      items,
      pagination: {
        total_items: items.length,
        total_pages: Math.ceil(items.length / (filter.per_page ?? 10)),
        current_page: filter.page ?? 1,
        per_page: filter.per_page ?? 10,
      },
    });
  });

  it("하위 카테고리 제외 시 부모 정보 제거", async () => {
    const filter = {
      page: 1,
      per_page: 10,
      sort: "created_at:desc",
      has_sub: false,
    };

    const result = await handler.execute({
      category_id: 1,
      dto: filter,
    });

    expect(result.category).toEqual({ id: 1, name: "대분류1", parent: null });
  });
});
