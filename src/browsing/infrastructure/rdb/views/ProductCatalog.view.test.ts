import { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";

import test_module from "__test-utils__/test-module";

import { IViewRepository } from "@shared/repositories";
import ProductCatalogView from "./ProductCatalog.view";

describe("ProductCatalogView", () => {
  let dataSource: DataSource;
  let repository: IViewRepository<ProductCatalogView>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    dataSource = module.get(DataSource);
    repository = module.get("IProductCatalogViewRepository");
  });

  describe("ProductCatalogView 정의", () => {
    it("올바른 뷰 이름", () => {
      const entityMetadata = dataSource.getRepository(ProductCatalogView).metadata;

      expect(entityMetadata.tableName).toBe("product_catalog_view");
    });

    it("뷰 컬럼 정의", () => {
      const entityMetadata = dataSource.getRepository(ProductCatalogView).metadata;

      const columns = [
        "id",
        "name",
        "slug",
        "short_description",
        "full_description",
        "status",
        "created_at",
        "updated_at",
        "seller",
        "brand",
        "detail",
        "price",
        "categories",
        "option_groups",
        "images",
        "tags",
        "rating",
      ];

      columns.forEach((column) => {
        const col = entityMetadata.columns.find((c) => c.propertyName === column);
        expect(col).toBeDefined();
      });
    });
  });

  describe("ProductCatalogView 데이터 조회", () => {
    it("뷰 데이터를 조회", async () => {
      const mockData = {
        id: 1,
        name: "Test Product",
        slug: "test-product",
        short_description: "Test short description",
        full_description: "Test full description",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
        seller: { id: 1, name: "Test Seller" },
        brand: { id: 1, name: "Test Brand" },
        detail: { weight: 1.2, dimensions: "10x10x10" },
        price: { base_price: 100, sale_price: 80, discount_percentage: 20 },
        categories: [{ id: 1, name: "Category 1" }],
        option_groups: [{ id: 1, name: "Option Group 1" }],
        images: [{ url: "image_url", alt_text: "image_alt" }],
        tags: [{ id: 1, name: "Tag 1" }],
        rating: {
          average: 4.5,
          count: 10,
          distribution: { "5": 5, "4": 3, "3": 1, "2": 1, "1": 0 },
        },
      };

      repository.find = jest.fn().mockResolvedValue([mockData]);

      const result = await repository.find();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockData);
    });

    it("특정 ID로 뷰 데이터를 조회", async () => {
      const mockData = new ProductCatalogView();
      mockData.id = 1;
      mockData.name = "Test Product";

      repository.findOne = jest.fn().mockResolvedValue(mockData);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockData);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("Test Product");
    });

    it("뷰 데이터가 없는 경우", async () => {
      repository.find = jest.fn().mockResolvedValue([]);

      const result = await repository.find();

      expect(result).toHaveLength(0);
    });

    it("뷰 데이터를 필터링하여 조회", async () => {
      const mockData = new ProductCatalogView();
      mockData.id = 2;
      mockData.name = "Filtered Product";

      repository.find = jest.fn().mockResolvedValue([mockData]);

      const result = await repository.find({ where: { status: "active" } });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockData);
    });
  });
});
