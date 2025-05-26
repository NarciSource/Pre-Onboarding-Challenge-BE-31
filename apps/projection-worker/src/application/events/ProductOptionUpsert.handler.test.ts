import { TestingModule } from "@nestjs/testing";

import { Product_Option, Product_Image } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import ProductOptionUpsertEvent from "./ProductOptionUpsert.event";
import ProductOptionUpsertHandler from "./ProductOptionUpsert.handler";

describe("ProductOptionUpsertHandler", () => {
  let handler: ProductOptionUpsertHandler;

  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ProductOptionUpsertHandler);

    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    catalog_query_repository.updateOne = jest.fn();
    catalog_query_repository.update = jest.fn();
    catalog_query_repository.findOne = jest.fn();
    summary_query_repository.updateOne = jest.fn();
    summary_query_repository.findOne = jest.fn();
  });

  describe("product_options 테이블 이벤트", () => {
    it("옵션 upsert 시 해당 옵션이 option_groups에 추가 또는 수정", async () => {
      const option_group_id = 10;
      const option_id = 5;
      const event = {
        table: "product_options",
        after: { id: option_id, option_group_id, name: "업서트 옵션" } as Product_Option,
      } as ProductOptionUpsertEvent;
      const catalog = {
        id: 1,
        option_groups: [
          {
            id: option_group_id,
            options: [{ id: 99, name: "기존 옵션" }],
          },
          {
            id: 999,
            options: [{ id: 100, name: "다른 그룹 옵션" }],
          },
        ],
      } as ProductCatalogModel;
      catalog_query_repository.update = jest.fn().mockReturnValue({ modifiedCount: 1 });
      catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

      await handler.handle(event);

      expect(catalog_query_repository.update).toHaveBeenCalled();
    });
  });

  describe("product_images 테이블 이벤트", () => {
    it("이미지 upsert 시 catalog의 images에 추가 또는 수정", async () => {
      const image_id = 7;
      const product_id = 3;
      const event = {
        table: "product_images",
        after: {
          id: image_id,
          product_id,
          url: "업서트 이미지",
          is_primary: false,
        } as Product_Image,
      } as ProductOptionUpsertEvent;
      const catalog = {
        id: product_id,
        images: [{ id: 8, url: "기존 이미지" }],
      } as ProductCatalogModel;

      catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: product_id },
        {
          images: [
            { id: 8, url: "기존 이미지" },
            { id: image_id, url: "업서트 이미지", is_primary: false },
          ],
        },
        { upsert: true },
      );
    });

    it("is_primary가 true면 summary의 primary_image도 업데이트", async () => {
      const product_id = 3;
      const event = {
        table: "product_images",
        after: { product_id, url: "url", alt_text: "text", is_primary: true } as Product_Image,
      } as ProductOptionUpsertEvent;

      await handler.handle(event);

      expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
        { id: product_id },
        { primary_image: { url: "url", alt_text: "text" } },
        { upsert: true },
      );
    });

    it("is_primary가 false면 summary는 업데이트하지 않음", async () => {
      const event = {
        table: "product_images",
        after: {
          product_id: 3,
          is_primary: false,
        } as Product_Image,
      } as ProductOptionUpsertEvent;

      await handler.handle(event);

      expect(summary_query_repository.updateOne).not.toHaveBeenCalled();
    });
  });
});
