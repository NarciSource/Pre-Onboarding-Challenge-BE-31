import {
  Inject,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository, IQueryRepository, IViewRepository } from "@shared/repositories";
import { ProductOptionEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView } from "@browsing/infrastructure/rdb/views";
import OptionRemoveCommand from "./OptionRemove.command";

@CommandHandler(OptionRemoveCommand)
export default class OptionRemoveHandler implements ICommandHandler<OptionRemoveCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IProductOptionsRepository")
    private readonly repository: IBaseRepository<ProductOptionEntity>,
    @Inject("IProductCatalogViewRepository")
    private readonly catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async execute({ product_id, option_id }: OptionRemoveCommand): Promise<void> {
    const delete_success = await this.entity_manager.transaction(async (manager) => {
      const option_entity = await this.repository.with_transaction(manager).findOne({
        where: { id: option_id },
        relations: { option_group: { product: true } },
      });

      if (!option_entity) {
        throw new NotFoundException({
          message: "요청한 옵션을 찾을 수 없습니다.",
          details: { resourceType: "Option", resourceId: option_id },
        });
      }

      if (option_entity.option_group.product.id != product_id) {
        throw new ForbiddenException({
          message: "해당 옵션은 요청한 상품에 속하지 않습니다.",
          details: {
            expectedProductId: option_entity.option_group.product.id,
            receivedProductId: product_id,
          },
        });
      }

      const { affected } = await this.repository.with_transaction(manager).delete(option_id);

      {
        /**
         * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
         */
        const catalog = await this.catalog_view_repository.with_transaction(manager).findOneBy({
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

      return affected !== 0;
    });

    if (!delete_success) {
      throw new InternalServerErrorException("옵션 삭제에 실패했습니다.");
    }
  }
}
