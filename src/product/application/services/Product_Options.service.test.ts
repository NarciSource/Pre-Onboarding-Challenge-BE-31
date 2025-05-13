import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { Product_Image, Product_Option } from "@product/domain/entities";
import {
  ProductImageEntity,
  ProductOptionEntity,
  ProductOptionGroupEntity,
} from "@product/infrastructure/entities";
import ProductOptionsService from "./Product_Options.service";

describe("ProductOptionsService", () => {
  let service: ProductOptionsService;
  let optionGroupRepository: IBaseRepository<ProductOptionGroupEntity>;
  let optionsRepository: IBaseRepository<ProductOptionEntity>;
  let imageRepository: IBaseRepository<ProductImageEntity>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    service = module.get(ProductOptionsService);
    optionGroupRepository = module.get("IProductOptionGroupRepository");
    optionsRepository = module.get("IProductOptionsRepository");
    imageRepository = module.get("IProductImageRepository");

    optionsRepository.with_transaction = jest.fn().mockReturnValue(optionsRepository);
    optionGroupRepository.with_transaction = jest.fn().mockReturnValue(optionGroupRepository);
  });

  describe("register", () => {
    it("옵션 등록", async () => {
      const product_id = 1;
      const option_group_id = 1;
      const options = { name: "옵션 등록" } as Omit<Product_Option, "id" | "option_group_id">;
      const option_group = {
        id: option_group_id,
        product: { id: product_id },
      } as Partial<Product_Option>;

      optionGroupRepository.findOne = jest.fn().mockResolvedValue(option_group);
      optionsRepository.save = jest.fn().mockResolvedValue({ ...options, option_group });

      const result = await service.register(product_id, option_group_id, options);

      expect(result).toEqual({
        ...options,
        option_group_id: option_group.id,
      });
    });

    it("찾을 수 없는 옵션 그룹으로 등록 실패 시 NotFoundException 발생", async () => {
      const product_id = 1;
      const option_group_id = 1;
      const options = { name: "옵션 등록" } as Omit<Product_Option, "id" | "option_group_id">;

      optionGroupRepository.findOne = jest.fn().mockResolvedValue(null);

      const registerPromise = service.register(product_id, option_group_id, options);

      await expect(registerPromise).rejects.toThrow(NotFoundException);
    });

    it("요청에 해당하는 상품이 아닌 경우 ForbiddenException 발생", async () => {
      const product_id = 1;
      const option_group_id = 1;
      const options = { name: "옵션 등록" } as Omit<Product_Option, "id" | "option_group_id">;

      optionGroupRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: option_group_id, product: { id: 2 } });

      const registerPromise = service.register(product_id, option_group_id, options);

      await expect(registerPromise).rejects.toThrow(ForbiddenException);
    });
  });

  describe("updated", () => {
    it("옵션 수정", async () => {
      const product_id = 1;
      const option_id = 1;
      const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;
      const updatedOption = {
        option_group: { id: 1 },
        ...options,
      };

      optionsRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: option_id, option_group: { product: { id: product_id } } });
      optionsRepository.save = jest.fn().mockResolvedValue(updatedOption);

      const result = await service.update(product_id, option_id, options);

      expect(result).toEqual({
        ...options,
        option_group_id: updatedOption.option_group.id,
      });
    });

    it("찾을 수 없는 옵션으로 수정 실패 시 NotFoundException 발생", async () => {
      const product_id = 1;
      const option_id = 1;
      const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;

      optionsRepository.findOne = jest.fn().mockResolvedValue(null);

      const updatePromise = service.update(product_id, option_id, options);

      await expect(updatePromise).rejects.toThrow(NotFoundException);
    });

    it("요청에 해당하는 상품이 아닌 경우 ForbiddenException 발생", async () => {
      const product_id = 1;
      const option_id = 1;
      const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;

      optionsRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: option_id, option_group: { product: { id: 2 } } });

      const updatePromise = service.update(product_id, option_id, options);

      await expect(updatePromise).rejects.toThrow(ForbiddenException);
    });
  });

  describe("remove", () => {
    it("옵션 삭제", async () => {
      const product_id = 1;
      const option_id = 1;

      optionsRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: option_id, option_group: { product: { id: product_id } } });
      optionsRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await service.remove(product_id, option_id);

      expect(optionsRepository.delete).toHaveBeenCalledWith(option_id);
    });

    it("찾을 수 없는 옵션으로 삭제 실패 시 NotFoundException 발생", async () => {
      const product_id = 1;
      const option_id = 1;

      optionsRepository.findOne = jest.fn().mockResolvedValue(null);

      const removePromise = service.remove(product_id, option_id);

      await expect(removePromise).rejects.toThrow(NotFoundException);
    });

    it("요청에 해당하는 상품이 아닌 경우 ForbiddenException 발생", async () => {
      const product_id = 1;
      const option_id = 1;

      optionsRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: option_id, option_group: { product: { id: 2 } } });

      const removePromise = service.remove(product_id, option_id);

      await expect(removePromise).rejects.toThrow(ForbiddenException);
    });

    it("옵션 삭제 실패 시 InternalServerError 발생", async () => {
      const product_id = 1;
      const option_id = 1;

      optionsRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: option_id, option_group: { product: { id: product_id } } });
      optionsRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      const removePromise = service.remove(product_id, option_id);

      await expect(removePromise).rejects.toThrow(InternalServerErrorException);
      expect(optionsRepository.delete).toHaveBeenCalledWith(option_id);
    });
  });

  describe("register_images", () => {
    it("옵션 이미지 등록", async () => {
      const product_id = 1;
      const option_id = 1;
      const image = { url: "image-url", option: { id: option_id } } as Omit<
        Product_Image,
        "product_id" | "option_id"
      >;

      imageRepository.save = jest.fn().mockResolvedValue(image);

      const result = await service.register_images(product_id, option_id, image);

      expect(result).toEqual({ url: "image-url", option_id });
    });
  });
});
