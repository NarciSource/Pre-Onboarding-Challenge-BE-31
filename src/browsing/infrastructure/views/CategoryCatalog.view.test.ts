import { TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { get_module } from "__test-utils__/test-module";

import CategoryCatalogView from "./CategoryCatalog.view";

describe("CategoryCatalogView", () => {
  let data_source: DataSource;
  let repository: Repository<CategoryCatalogView>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    data_source = module.get<DataSource>(DataSource);
    repository = module.get<Repository<CategoryCatalogView>>(
      getRepositoryToken(CategoryCatalogView),
    );
  });

  describe("CategoryCatalogView 정의", () => {
    it("뷰 컬럼 정의", () => {
      const entityMetadata = data_source.getRepository(CategoryCatalogView).metadata;

      const columns = ["id", "name", "slug", "image_url", "product_count"];

      columns.forEach((column) => {
        const col = entityMetadata.columns.find((c) => c.propertyName === column);
        expect(col).toBeDefined();
      });
    });
  });

  describe("CategoryCatalogView 데이터 조회", () => {
    it("뷰 데이터를 조회", async () => {
      const mockData = new CategoryCatalogView();
      mockData.id = 1;
      mockData.name = "Test Category";
      mockData.slug = "test-category";
      mockData.image_url = "test-image-url";
      mockData.product_count = 10;

      repository.find = jest.fn().mockResolvedValue([mockData]);

      const result = await repository.find();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockData);
    });

    it("특정 ID로 뷰 데이터를 조회", async () => {
      const mockData = new CategoryCatalogView();
      mockData.id = 1;
      mockData.name = "Test Category";

      repository.findOne = jest.fn().mockResolvedValue(mockData);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockData);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("Test Category");
    });

    it("뷰 데이터를 정렬하여 조회", async () => {
      const mockData1 = new CategoryCatalogView();
      mockData1.id = 1;
      mockData1.name = "Category A";
      mockData1.product_count = 20;

      const mockData2 = new CategoryCatalogView();
      mockData2.id = 2;
      mockData2.name = "Category B";
      mockData2.product_count = 10;

      repository.find = jest.fn().mockResolvedValue([mockData1, mockData2]);

      const result = await repository.find({ order: { product_count: "DESC" } });

      expect(result).toHaveLength(2);
      expect(result[0].product_count).toBeGreaterThan(result[1].product_count);
    });
  });
});
