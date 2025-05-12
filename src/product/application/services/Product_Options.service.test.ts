import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { Product_Image, Product_Option } from "@product/domain/entities";
import { ProductImageEntity, ProductOptionEntity } from "@product/infrastructure/entities";
import ProductOptionsService from "./Product_Options.service";

describe("ProductOptionsService", () => {
  let service: ProductOptionsService;
  let productOptionsRepository: IBaseRepository<ProductOptionEntity>;
  let productImageRepository: IBaseRepository<ProductImageEntity>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    service = module.get(ProductOptionsService);
    productOptionsRepository = module.get("IProductOptionsRepository");
    productImageRepository = module.get("IProductImageRepository");
  });

  it("옵션 등록", async () => {
    const id = 1;
    const option_group_id = 2;
    const option = { name: "옵션1" } as Omit<Product_Option, "option_group_id">;
    const savedOption = { option_group_id, ...option } as Product_Option;

    productOptionsRepository.save = jest.fn().mockResolvedValue(savedOption);

    const result = await service.register(id, option_group_id, option);

    expect(result).toEqual(savedOption);
  });

  it("옵션 수정", async () => {
    const product_id = 1;
    const option_id = 1;
    const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;
    const updatedOption = {
      option_group: { id: 1 },
      ...options,
    } as Product_Option;

    productOptionsRepository.update = jest.fn().mockResolvedValue(true);
    productOptionsRepository.findOneBy = jest.fn().mockResolvedValue(updatedOption);

    const result = await service.update(product_id, option_id, options);

    expect(result).toEqual({
      option_group_id: 1,
      ...updatedOption,
    });
  });

  it("옵션 수정 실패 시 NotFoundException 발생", async () => {
    const product_id = 1;
    const option_id = 1;
    const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;

    productOptionsRepository.update = jest.fn().mockResolvedValue(false);

    await expect(service.update(product_id, option_id, options)).rejects.toThrow(NotFoundException);
    expect(productOptionsRepository.update).toHaveBeenCalledWith(option_id, options);
  });

  it("옵션 삭제", async () => {
    const product_id = 1;
    const option_id = 1;

    productOptionsRepository.delete = jest.fn().mockResolvedValue(true);

    await service.remove(product_id, option_id);

    expect(productOptionsRepository.delete).toHaveBeenCalledWith(option_id);
  });

  it("옵션 삭제 실패 시 NotFoundException 발생", async () => {
    const product_id = 1;
    const option_id = 1;

    productOptionsRepository.delete = jest.fn().mockResolvedValue(false);

    await expect(service.remove(product_id, option_id)).rejects.toThrow(NotFoundException);
    expect(productOptionsRepository.delete).toHaveBeenCalledWith(option_id);
  });

  it("옵션 이미지 등록", async () => {
    const id = 1;
    const option_id = 1;
    const image = { url: "image-url" } as Omit<Product_Image, "product_id" | "option_id">;

    productImageRepository.save = jest.fn().mockResolvedValue(image);

    const result = await service.register_images(id, option_id, image);

    expect(result).toEqual({
      url: "image-url",
      option_id,
    });
  });
});
