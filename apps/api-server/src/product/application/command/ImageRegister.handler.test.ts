import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { Product_Image } from "@libs/domain/entities";
import { IBaseRepository } from "@libs/domain/repository";
import { ProductEntity } from "@libs/infrastructure/rdb/entities";
import ImageRegisterHandler from "./ImageRegister.handler";

describe("ImageRegisterHandler", () => {
  let handler: ImageRegisterHandler;

  let imageRepository: IBaseRepository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ImageRegisterHandler);

    imageRepository = module.get("IProductImageRepository");
  });

  it("옵션 이미지 등록", async () => {
    const product_id = 1;
    const option_id = 1;
    const image = { url: "image-url", option: { id: option_id } } as Omit<
      Product_Image,
      "product_id" | "option_id"
    >;

    imageRepository.save = jest.fn().mockResolvedValue(image);

    const result = await handler.execute({ product_id, option_id, image });

    expect(result).toEqual({ url: "image-url", option_id });
  });
});
