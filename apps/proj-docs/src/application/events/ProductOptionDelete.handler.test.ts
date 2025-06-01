import { TestingModule } from "@nestjs/testing";

import { Product_Option, Product_Image } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import test_module from "../../__test-utils__/test-module";
import ProductOptionDeleteEvent from "./ProductOptionDelete.event";
import ProductOptionDeleteHandler from "./ProductOptionDelete.handler";

describe("ProductOptionDeleteHandler", () => {
  let handler: ProductOptionDeleteHandler;

  let catalog_query_repository: IQueryRepository<ProductCatalogModel>;
  let summary_query_repository: IQueryRepository<ProductSummaryModel>;

  beforeEach(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ProductOptionDeleteHandler);

    catalog_query_repository = module.get("IProductCatalogQueryRepository");
    summary_query_repository = module.get("IProductSummaryQueryRepository");
    catalog_query_repository.updateOne = jest.fn();
    catalog_query_repository.findOne = jest.fn();
    summary_query_repository.updateOne = jest.fn();
  });

  describe("product_options 테이블 이벤트", () => {
    it("옵션 삭제 시 해당 옵션이 option_groups에서 제거", async () => {
      const option_group_id = 10;
      const option_id = 5;
      const event = {
        table: "product_options",
        after: { id: option_id, option_group_id } as Product_Option,
      } as ProductOptionDeleteEvent;
      const catalog = {
        id: 1,
        option_groups: [
          {
            id: option_group_id,
            options: [
              { id: option_id, name: "삭제될 옵션" },
              { id: 99, name: "남을 옵션" },
            ],
          },
          {
            id: 999,
            options: [{ id: 100, name: "다른 그룹 옵션" }],
          },
        ],
      } as ProductCatalogModel;
      catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalled();
    });

    it("catalog가 없으면 아무 동작도 하지 않음", async () => {
      const event = {
        table: "product_options",
        after: { id: 1, option_group_id: 2 } as Product_Option,
      } as ProductOptionDeleteEvent;

      catalog_query_repository.findOne = jest.fn().mockResolvedValue(null);

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).not.toHaveBeenCalled();
    });
  });

  describe("product_images 테이블 이벤트", () => {
    it("이미지 삭제 시 catalog의 images에서 제거", async () => {
      const image_id = 7;
      const product_id = 3;
      const event = {
        table: "product_images",
        before: { id: image_id, product_id, is_primary: false } as Product_Image,
      } as ProductOptionDeleteEvent;
      const catalog = {
        id: product_id,
        images: [
          { id: image_id, url: "삭제될 이미지" },
          { id: 8, url: "남을 이미지" },
        ],
      } as ProductCatalogModel;

      catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

      await handler.handle(event);

      expect(catalog_query_repository.updateOne).toHaveBeenCalledWith(
        { id: product_id },
        { images: [{ id: 8, url: "남을 이미지" }] },
        { upsert: true },
      );
    });

    it("is_primary가 true면 summary의 primary_image도 null로 업데이트", async () => {
      const image_id = 7;
      const product_id = 3;
      const event = {
        table: "product_images",
        before: { id: image_id, product_id, is_primary: true } as Product_Image,
      } as ProductOptionDeleteEvent;
      const catalog = {
        id: product_id,
        images: [
          { id: image_id, url: "삭제될 이미지" },
          { id: 8, url: "남을 이미지" },
        ],
      } as ProductCatalogModel;

      catalog_query_repository.findOne = jest.fn().mockResolvedValue(catalog);

      await handler.handle(event);

      expect(summary_query_repository.updateOne).toHaveBeenCalledWith(
        { id: product_id },
        { primary_image: null },
        { upsert: true },
      );
    });

    it("is_primary가 false면 summary는 업데이트하지 않음", async () => {
      const event = {
        table: "product_images",
        before: { id: 7, product_id: 3, is_primary: false } as Product_Image,
      } as ProductOptionDeleteEvent;

      await handler.handle(event);

      expect(summary_query_repository.updateOne).not.toHaveBeenCalled();
    });
  });
});
