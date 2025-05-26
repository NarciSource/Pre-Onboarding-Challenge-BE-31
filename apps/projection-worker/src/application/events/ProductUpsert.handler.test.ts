import { TestingModule } from "@nestjs/testing";
import { UpdateWriteOpResult } from "mongoose";

import {
  Product,
  Product_Detail,
  Product_Category,
  Product_Price,
  Product_Option_Group,
  Product_Tag,
} from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import { CategoryStateModel, TagStateModel } from "../../infrastructure/model";
import ProductUpsertEvent from "./ProductUpsert.event";
import ProductUpsertHandler from "./ProductUpsert.handler";

describe("ProductUpsertHandler", () => {
  let handler: ProductUpsertHandler;

  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;
  let category_state_repository: IQueryRepository<CategoryStateModel>;
  let tag_state_repository: IQueryRepository<TagStateModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ProductUpsertHandler);

    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    category_state_repository = module.get("ICategoryStateRepository");
    tag_state_repository = module.get("ITagStateRepository");

    catalog_query_repository.updateOne = jest.fn();
    catalog_query_repository.update = jest.fn();
    catalog_query_repository.findOne = jest.fn();
    catalog_query_repository.aggregate = jest.fn();
    summary_query_repository.updateOne = jest.fn();
    category_state_repository.findOne = jest.fn();
    category_state_repository.aggregate = jest.fn();
    category_state_repository.updateOne = jest.fn();
    tag_state_repository.findOne = jest.fn();
  });

  describe("products 테이블 이벤트", () => {
    it("products 테이블 upsert 시 catalog/summary에 저장", async () => {
      const event = {
        table: "products",
        after: { id: 1, brand_id: 2, seller_id: 3, name: "상품" } as Product,
      } as ProductUpsertEvent;

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { id: 1, name: "상품", brand: { id: 2 }, seller: { id: 3 } },
        { upsert: true },
      );
      expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { id: 1, name: "상품", brand: { id: 2 }, seller: { id: 3 } },
        { upsert: true },
      );
    });
  });

  describe("product_details 테이블 이벤트", () => {
    it("product_details 테이블 upsert 시 catalog.detail에 저장", async () => {
      const event = {
        table: "product_details",
        after: { product_id: 1, materials: "재료" } as Product_Detail,
      } as ProductUpsertEvent;

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { detail: { materials: "재료" } },
        { upsert: true },
      );
    });
  });

  describe("product_categories 테이블 이벤트", () => {
    it("product_categories 테이블 upsert 시 catalog.categories에 추가 및 카테고리 product_count 증가", async () => {
      const event = {
        table: "product_categories",
        after: { product_id: 1, category_id: 10, is_primary: true } as Product_Category,
      } as ProductUpsertEvent;
      const catalog = { id: 1, categories: [{ id: 99 }] } as ProductCatalogModel;
      const category = [{ id: 10, name: "카테고리" }] as CategoryStateModel[];

      catalog_query_repository.findOne = jest.fn().mockReturnValue(catalog);
      category_state_repository.aggregate = jest.fn().mockResolvedValue(category);

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { categories: [{ id: 99 }, { id: 10, name: "카테고리", is_primary: true }] },
        { upsert: true },
      );
      expect(category_state_repository.updateOne).toHaveBeenCalledWith(
        { id: 10 },
        { $inc: { product_count: 1 } },
      );
    });
  });

  describe("product_prices 테이블 이벤트", () => {
    it("product_prices 테이블 upsert 시 catalog.price/summary에 저장", async () => {
      const event = {
        table: "product_prices",
        after: { product_id: 1, base_price: 1000, sale_price: 800 } as Product_Price,
      } as ProductUpsertEvent;

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { price: { base_price: 1000, sale_price: 800, discount_percentage: 20 } },
        { upsert: true },
      );
      expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { base_price: 1000, sale_price: 800 },
      );
    });
  });

  describe("product_option_groups 테이블 이벤트", () => {
    it("기존 그룹 있으면 option_groups.$ 수정", async () => {
      const event = {
        table: "product_option_groups",
        after: { id: 5, product_id: 1, name: "옵션그룹" } as Product_Option_Group,
      } as ProductUpsertEvent;
      const returnValue = { modifiedCount: 1 } as UpdateWriteOpResult;

      catalog_query_repository.update = jest.fn().mockResolvedValue(returnValue);

      await handler.handle(event);

      expect(catalog_query_repository.update).toHaveBeenCalled();
    });

    it("기존 그룹 없으면 option_groups에 추가", async () => {
      const event = {
        table: "product_option_groups",
        after: { id: 5, product_id: 1, name: "옵션그룹" } as Product_Option_Group,
      } as ProductUpsertEvent;
      const returnValue = { modifiedCount: 1 } as UpdateWriteOpResult;

      catalog_query_repository.update = jest.fn().mockResolvedValue(returnValue);

      await handler.handle(event);

      expect(catalog_query_repository.update).toHaveBeenCalled();
    });
  });

  describe("product_tags 테이블 이벤트", () => {
    it("product_tags 테이블 upsert 시 catalog.tags에 추가", async () => {
      const event = {
        table: "product_tags",
        after: { product_id: 1, tag_id: 7 } as Product_Tag,
      } as ProductUpsertEvent;
      const catalog = { id: 1, tags: [{ id: 99 }] } as ProductCatalogModel;
      const tag = { id: 7, name: "태그" } as TagStateModel;

      catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);
      tag_state_repository.findOne = jest.fn().mockResolvedValue(tag);

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: 1 },
        { tags: [{ id: 99 }, { id: 7, name: "태그" }] },
        { upsert: true },
      );
    });
  });
});
