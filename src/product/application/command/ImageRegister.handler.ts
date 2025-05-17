import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { IBaseRepository, IQueryRepository, IViewRepository } from "@shared/repositories";
import { ProductImageEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView } from "@browsing/infrastructure/rdb/views";
import ImageRegisterCommand from "./ImageRegister.command";

@CommandHandler(ImageRegisterCommand)
export default class ImageRegisterHandler implements ICommandHandler<ImageRegisterCommand> {
  constructor(
    @Inject("IProductImageRepository")
    private readonly product_image_repository: IBaseRepository<ProductImageEntity>,
    @Inject("IProductCatalogViewRepository")
    private readonly catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async execute({ product_id, option_id, image }: ImageRegisterCommand) {
    const saved_product_image = await this.product_image_repository.save({
      product: { id: product_id },
      option: option_id ? { id: option_id } : null,
      ...image,
    });

    {
      /**
       * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
       */
      const catalog = await this.catalog_view_repository.findOneBy({
        id: product_id,
      });

      if (!catalog) {
        throw new NotFoundException({
          message: "상품 카탈로그를 찾을 수 없습니다.",
          details: { resourceType: "ProductCatalog", resourceId: product_id },
        });
      }

      await this.catalog_query_repository.update(product_id, catalog);
    }

    // 이미지 저장 결과 반환
    const { product: _product, option, ...rest } = saved_product_image;
    return { ...rest, option_id: option ? option.id : null };
  }
}
