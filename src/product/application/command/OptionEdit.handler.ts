import { ForbiddenException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { ProductOptionEntity } from "@product/infrastructure/rdb/entities";
import { QueryUpdateEvent } from "@browsing/application/event";
import OptionEditCommand from "./OptionEdit.command";

@CommandHandler(OptionEditCommand)
export default class OptionEditHandler implements ICommandHandler<OptionEditCommand> {
  constructor(
    private readonly event_bus: EventBus,

    private readonly entity_manager: EntityManager,
    @Inject("IProductOptionsRepository")
    private readonly repository: IBaseRepository<ProductOptionEntity>,
  ) {}

  async execute({ product_id, option_id, options }: OptionEditCommand) {
    const updated = await this.entity_manager.transaction(async (manager) => {
      // 정합성 체크
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

      // 상품 옵션 업데이트
      Object.assign(option_entity, options);
      const updated = await this.repository.with_transaction(manager).save(option_entity);

      {
        /**
         * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
         */
        const event = new QueryUpdateEvent(product_id, manager);

        await this.event_bus.publish(event);
      }

      return updated;
    });

    // 반환 형식 변환
    const { option_group, ...rest } = updated;
    return { ...rest, option_group_id: option_group.id };
  }
}
