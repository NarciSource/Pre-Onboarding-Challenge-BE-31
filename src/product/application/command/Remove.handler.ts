import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";

import { IBaseRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/rdb/entities";
import { QueryRemoveEvent } from "@browsing/application/event";
import RemoveCommand from "./Remove.command";

@CommandHandler(RemoveCommand)
export default class RemoveHandler implements ICommandHandler<RemoveCommand> {
  constructor(
    private readonly event_bus: EventBus,

    @Inject("IProductRepository")
    private readonly repository: IBaseRepository<ProductEntity>,
  ) {}

  async execute({ id }: RemoveCommand): Promise<void> {
    const { affected } = await this.repository.delete(id);

    if (!affected) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Product", resourceId: id },
      });
    }

    {
      /**
       * 쿼리 레포지토리로 수동 업데이트
       */
      const event = new QueryRemoveEvent(id);

      await this.event_bus.publish(event);
    }
  }
}
