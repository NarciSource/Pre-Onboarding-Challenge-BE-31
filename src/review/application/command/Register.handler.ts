import { Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import { QueryUpdateEvent } from "@browsing/application/event";
import RegisterCommand from "./Register.command";

@CommandHandler(RegisterCommand)
export default class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly event_bus: EventBus,

    private readonly entity_manager: EntityManager,
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
  ) {}

  async execute({ product_id, dto }: RegisterCommand) {
    const created = await this.entity_manager.transaction(async (manager) => {
      const { id } = await this.repository
        .with_transaction(manager)
        .save({ product: { id: product_id }, ...dto });

      const created = await this.repository
        .with_transaction(manager)
        .findOne({ where: { id }, relations: ["user"] });

      return created;
    });

    {
      /**
       * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
       */
      const event = new QueryUpdateEvent(product_id);

      await this.event_bus.publish(event);
    }

    return created!;
  }
}
