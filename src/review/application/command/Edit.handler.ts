import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import { QueryUpdateEvent } from "@browsing/application/event";
import EditCommand from "./Edit.command";

@CommandHandler(EditCommand)
export default class EditHandler implements ICommandHandler<EditCommand> {
  constructor(
    private readonly event_bus: EventBus,

    private readonly entity_manager: EntityManager,
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
  ) {}

  async execute({ id: review_id, dto }: EditCommand) {
    const updated = await this.entity_manager.transaction(async (manager) => {
      const { affected } = await this.repository.with_transaction(manager).update(review_id, dto);

      if (!affected) {
        throw new NotFoundException({
          message: "요청한 리소스를 찾을 수 없습니다.",
          details: { resourceType: "Review", resourceId: review_id },
        });
      }

      const updated = await this.repository
        .with_transaction(manager)
        .findOne({ where: { id: review_id }, relations: ["product"] });

      return updated;
    });

    {
      /**
       * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
       */
      if (updated?.product.id) {
        const event = new QueryUpdateEvent(updated?.product.id);

        await this.event_bus.publish(event);
      }
    }

    const { id, rating, title, content, updated_at } = updated!;
    return { id, rating, title, content, updated_at };
  }
}
