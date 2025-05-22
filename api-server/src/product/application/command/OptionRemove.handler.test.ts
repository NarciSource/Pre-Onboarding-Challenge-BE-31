import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import {
  ProductOptionEntity,
  ProductOptionGroupEntity,
} from "@product/infrastructure/rdb/entities";
import OptionRemoveHandler from "./OptionRemove.handler";

describe("OptionRemoveHandler", () => {
  let handler: OptionRemoveHandler;

  let optionGroupRepository: IBaseRepository<ProductOptionGroupEntity>;
  let optionsRepository: IBaseRepository<ProductOptionEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(OptionRemoveHandler);

    optionGroupRepository = module.get("IProductOptionGroupRepository");
    optionsRepository = module.get("IProductOptionsRepository");

    optionsRepository.with_transaction = jest.fn().mockReturnValue(optionsRepository);
    optionGroupRepository.with_transaction = jest.fn().mockReturnValue(optionGroupRepository);
  });

  it("옵션 삭제", async () => {
    const product_id = 1;
    const option_id = 1;

    optionsRepository.findOne = jest
      .fn()
      .mockResolvedValue({ id: option_id, option_group: { product: { id: product_id } } });
    optionsRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

    await handler.execute({ product_id, option_id });

    expect(optionsRepository.delete).toHaveBeenCalledWith(option_id);
  });

  it("찾을 수 없는 옵션으로 삭제 실패 시 NotFoundException 발생", async () => {
    const product_id = 1;
    const option_id = 1;

    optionsRepository.findOne = jest.fn().mockResolvedValue(null);

    const removePromise = handler.execute({ product_id, option_id });

    await expect(removePromise).rejects.toThrow(NotFoundException);
  });

  it("요청에 해당하는 상품이 아닌 경우 ForbiddenException 발생", async () => {
    const product_id = 1;
    const option_id = 1;

    optionsRepository.findOne = jest
      .fn()
      .mockResolvedValue({ id: option_id, option_group: { product: { id: 2 } } });

    const removePromise = handler.execute({ product_id, option_id });

    await expect(removePromise).rejects.toThrow(ForbiddenException);
  });

  it("옵션 삭제 실패 시 InternalServerError 발생", async () => {
    const product_id = 1;
    const option_id = 1;

    optionsRepository.findOne = jest
      .fn()
      .mockResolvedValue({ id: option_id, option_group: { product: { id: product_id } } });
    optionsRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

    const removePromise = handler.execute({ product_id, option_id });

    await expect(removePromise).rejects.toThrow(InternalServerErrorException);
    expect(optionsRepository.delete).toHaveBeenCalledWith(option_id);
  });
});
