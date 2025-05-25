import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { Product_Option } from "@libs/domain/entities";
import { IBaseRepository } from "@libs/domain/repository";
import { ProductOptionEntity, ProductOptionGroupEntity } from "@libs/infrastructure/rdb/entities";
import OptionEditHandler from "./OptionEdit.handler";

describe("OptionEditHandler", () => {
  let handler: OptionEditHandler;

  let optionGroupRepository: IBaseRepository<ProductOptionGroupEntity>;
  let optionsRepository: IBaseRepository<ProductOptionEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(OptionEditHandler);

    optionGroupRepository = module.get("IProductOptionGroupRepository");
    optionsRepository = module.get("IProductOptionsRepository");

    optionsRepository.with_transaction = jest.fn().mockReturnValue(optionsRepository);
    optionGroupRepository.with_transaction = jest.fn().mockReturnValue(optionGroupRepository);
  });

  it("옵션 수정", async () => {
    const product_id = 1;
    const option_id = 1;
    const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;
    const updatedOption = {
      ...options,
      option_group: { id: 1 },
    };

    optionsRepository.findOne = jest
      .fn()
      .mockResolvedValue({ id: option_id, option_group: { product: { id: product_id } } });
    optionsRepository.save = jest.fn().mockResolvedValue(updatedOption);

    const result = await handler.execute({ product_id, option_id, options });

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

    const updatePromise = handler.execute({ product_id, option_id, options });

    await expect(updatePromise).rejects.toThrow(NotFoundException);
  });

  it("요청에 해당하는 상품이 아닌 경우 ForbiddenException 발생", async () => {
    const product_id = 1;
    const option_id = 1;
    const options = { name: "옵션 수정" } as Omit<Product_Option, "option_group_id">;

    optionsRepository.findOne = jest
      .fn()
      .mockResolvedValue({ id: option_id, option_group: { product: { id: 2 } } });

    const updatePromise = handler.execute({ product_id, option_id, options });

    await expect(updatePromise).rejects.toThrow(ForbiddenException);
  });
});
