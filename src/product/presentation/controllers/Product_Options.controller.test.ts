import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { ProductOptionsService } from "@product/application/services";
import { Product_Image, Product_Option } from "@product/domain/entities";
import {
  ImageDTO,
  OptionParamDTO,
  ProductOptionBodyDTO,
  ProductOptionBodyWithGroupDTO,
  ProductOptionDTO,
  ProductOptionImageBodyDTO,
  ResponseDTO,
} from "../dto";
import ProductOptionsController from "./Product_Options.controller";

describe("ProductOptionsController", () => {
  let controller: ProductOptionsController;
  let service: jest.Mocked<ProductOptionsService>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    controller = module.get(ProductOptionsController);
    service = module.get(ProductOptionsService);
  });

  describe("create_option", () => {
    it("상품 옵션 추가 성공", async () => {
      const param = { id: 1 };
      const body = { name: "Option 1" } as ProductOptionBodyWithGroupDTO;
      const data = {
        id: param.id,
        ...body,
      } as Product_Option;
      service.register = jest.fn().mockResolvedValue(data);

      const result: ResponseDTO<ProductOptionDTO> = await controller.create_option(param, body);

      expect(result).toEqual({
        success: true,
        data: { id: 1, name: "Option 1" },
        message: "상품 옵션이 성공적으로 추가되었습니다.",
      });
    });
  });

  describe("update_option", () => {
    it("상품 옵션 수정 성공", async () => {
      const param = { id: 1, optionId: 2 };
      const body = { name: "Updated Option" } as ProductOptionBodyDTO;
      const data = {
        id: param.id,
        option_group_id: param.optionId,
        ...body,
      } as Product_Option;
      service.edit = jest.fn().mockResolvedValue(data);

      const result: ResponseDTO<ProductOptionDTO> = await controller.update_option(param, body);

      expect(result).toEqual({
        success: true,
        data: {
          id: param.id,
          option_group_id: param.optionId,
          ...body,
        },
        message: "상품 옵션이 성공적으로 수정되었습니다.",
      });
    });
  });

  describe("delete_option", () => {
    it("상품 옵션 삭제 성공", async () => {
      const param = { id: 1, optionId: 2 };
      service.remove = jest.fn().mockResolvedValue(undefined);

      const result: ResponseDTO<null> = await controller.delete_option(param);

      expect(result).toEqual({
        success: true,
        data: null,
        message: "상품 옵션이 성공적으로 삭제되었습니다.",
      });
    });
  });

  describe("create_image", () => {
    it("상품 이미지 추가 성공", async () => {
      const param = { id: 1 } as OptionParamDTO;
      const body = {
        option_id: 2,
        url: "http://example.com/image.jpg",
      } as ProductOptionImageBodyDTO;
      const data = { id: param.id, url: body.url } as Product_Image;
      service.register_images = jest.fn().mockResolvedValue(data);

      const result: ResponseDTO<ImageDTO> = await controller.create_image(param, body);

      expect(result).toEqual({
        success: true,
        data: { id: 1, url: "http://example.com/image.jpg" },
        message: "상품 이미지가 성공적으로 추가되었습니다.",
      });
    });
  });
});
