import { EventBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { Product_Image } from "@product/domain/entities";
import { ProductEntity } from "@product/infrastructure/rdb/entities";
import { QueryUpdateEvent } from "@browsing/application/event";
import ImageRegisterHandler from "./ImageRegister.handler";

describe("ImageRegisterHandler", () => {
  let handler: ImageRegisterHandler;
  let event_bus: EventBus;

  let imageRepository: IBaseRepository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(ImageRegisterHandler);
    event_bus = module.get(EventBus);

    event_bus.publish = jest.fn();
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
    expect(event_bus.publish).toHaveBeenCalledWith(expect.any(QueryUpdateEvent));
  });
});
