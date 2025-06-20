import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@libs/domain/repository";
import { ProductOptionEntity, ProductOptionGroupEntity } from "@libs/infrastructure/rdb/entities";

import OptionRegisterCommand from "./OptionRegister.command";

@CommandHandler(OptionRegisterCommand)
export default class OptionRegisterHandler implements ICommandHandler<OptionRegisterCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IProductOptionsRepository")
    private readonly repository: IBaseRepository<ProductOptionEntity>,
    @Inject("IProductOptionGroupRepository")
    private readonly option_group_repository: IBaseRepository<ProductOptionGroupEntity>,
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

      return saved;
    });

    // 반환 형식 변환
    const { option_group, ...result } = saved;
    return { ...result, option_group_id: option_group.id };
  }
}
