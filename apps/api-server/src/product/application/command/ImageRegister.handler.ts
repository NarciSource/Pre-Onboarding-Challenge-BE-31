import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { IBaseRepository } from "@shared/repositories";
import { ProductImageEntity } from "@product/infrastructure/rdb/entities";
import ImageRegisterCommand from "./ImageRegister.command";

@CommandHandler(ImageRegisterCommand)
export default class ImageRegisterHandler implements ICommandHandler<ImageRegisterCommand> {
  constructor(
    @Inject("IProductImageRepository")
    private readonly product_image_repository: IBaseRepository<ProductImageEntity>,
  ) {}

  async execute({ product_id, option_id, image }: ImageRegisterCommand) {
    const saved_product_image = await this.product_image_repository.save({
      product: { id: product_id },
      option: option_id ? { id: option_id } : null,
      ...image,
    });

    // 이미지 저장 결과 반환
    const { product: _product, option, ...rest } = saved_product_image;
    return { ...rest, option_id: option?.id };
  }
}
