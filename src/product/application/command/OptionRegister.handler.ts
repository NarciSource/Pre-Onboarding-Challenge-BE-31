import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository, IQueryRepository, IViewRepository } from "@shared/repositories";
import {
  ProductOptionEntity,
  ProductOptionGroupEntity,
} from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView } from "@browsing/infrastructure/rdb/views";
import OptionRegisterCommand from "./OptionRegister.command";

@CommandHandler(OptionRegisterCommand)
export default class OptionRegisterHandler implements ICommandHandler<OptionRegisterCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IProductOptionsRepository")
    private readonly repository: IBaseRepository<ProductOptionEntity>,
    @Inject("IProductOptionGroupRepository")
    private readonly option_group_repository: IBaseRepository<ProductOptionGroupEntity>,
    @Inject("IProductCatalogViewRepository")
    private readonly catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async execute({ product_id, option_group_id, options: option }: OptionRegisterCommand) {
    const saved = await this.entity_manager.transaction(async (manager) => {
      // 정합성 체크
      const option_group_entity = await this.option_group_repository
        .with_transaction(manager)
        .findOne({
          where: { id: option_group_id },
          relations: { product: true },
        });

      if (!option_group_entity) {
        throw new NotFoundException({
          message: "요청한 옵션 그룹을 찾을 수 없습니다.",
          details: { resourceType: "OptionGroup", resourceId: option_group_id },
        });
      }

      if (option_group_entity.product.id != product_id) {
        throw new ForbiddenException({
          message: "해당 옵션 그룹은 요청한 상품에 속하지 않습니다.",
          details: {
            expectedProductId: option_group_entity.product.id,
            receivedProductId: product_id,
          },
        });
      }

      const saved = await this.repository.with_transaction(manager).save({
        ...option,
        option_group: option_group_entity,
      });

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

      return saved;
    });

    // 반환 형식 변환
    const { option_group, ...result } = saved;
    return { ...result, option_group_id: option_group.id };
  }
}
