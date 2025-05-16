import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { Product_Option } from "@product/domain/entities";
import { ProductOptionEntity, ProductOptionGroupEntity } from "@product/infrastructure/rdb/entities";
import OptionRegisterHandler from "./OptionRegister.handler";

describe("OptionRegisterHandler", () => {
  let handler: OptionRegisterHandler;
  let optionGroupRepository: IBaseRepository<ProductOptionGroupEntity>;
  let optionsRepository: IBaseRepository<ProductOptionEntity>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    handler = module.get<OptionRegisterHandler>(OptionRegisterHandler);

    optionGroupRepository = module.get("IProductOptionGroupRepository");
    optionsRepository = module.get("IProductOptionsRepository");

    optionsRepository.with_transaction = jest.fn().mockReturnValue(optionsRepository);
    optionGroupRepository.with_transaction = jest.fn().mockReturnValue(optionGroupRepository);
  });

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

    const result = await handler.execute({ product_id, option_group_id, options });

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

    const registerPromise = handler.execute({ product_id, option_group_id, options });

    await expect(registerPromise).rejects.toThrow(NotFoundException);
  });

  it("요청에 해당하는 상품이 아닌 경우 ForbiddenException 발생", async () => {
    const product_id = 1;
    const option_group_id = 1;
    const options = { name: "옵션 등록" } as Omit<Product_Option, "id" | "option_group_id">;

    optionGroupRepository.findOne = jest
      .fn()
      .mockResolvedValue({ id: option_group_id, product: { id: 2 } });

    const registerPromise = handler.execute({ product_id, option_group_id, options });

    await expect(registerPromise).rejects.toThrow(ForbiddenException);
  });
});
