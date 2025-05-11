import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository, IBrowsingRepository } from "@shared/repositories";
import { Category } from "@category/domain/entities";
import { CategoryEntity } from "@category/infrastructure/entities";
import { ProductSummaryView } from "@browsing/infrastructure/views";
import CategoryService from "./Category.service";

describe("CategoryService", () => {
  let service: CategoryService;
  let categoryRepository: IBaseRepository<CategoryEntity>;
  let productSummaryRepository: IBrowsingRepository<ProductSummaryView>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    service = module.get(CategoryService);
    categoryRepository = module.get("ICategoryRepository");
    productSummaryRepository = module.get("IProductSummaryRepository");
  });

  describe("find_all_as_tree", () => {
    it("카테고리를 트리 구조로 반환", async () => {
      const categories = [
        { id: 1, name: "대분류1", parent: null },
        { id: 2, name: "중분류1", parent: { id: 1 } as Category },
        { id: 3, name: "소분류1", parent: { id: 2 } as Category },
      ] as Category[];
      categoryRepository.find = jest.fn().mockResolvedValue(categories);

      const result = await service.find_all_as_tree();

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

    it("레벨 제한을 초과한 경우 빈 배열 반환", async () => {
      const categories: Category[] = [];
      categoryRepository.find = jest.fn().mockResolvedValue(categories);

      const result = await service.find_all_as_tree(4);

      expect(result).toEqual([]);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        relations: ["parent"],
      });
    });
  });

  describe("find_products_by_category_id", () => {
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

      const result = await service.find_products_by_category_id(1, filter);

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

      const result = await service.find_products_by_category_id(1, filter);

      expect(result.category).toEqual({ id: 1, name: "대분류1" });
    });
  });
});
