import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { IBaseRepository } from "@libs/domain/repository";
import { ReviewEntity } from "@libs/infrastructure/rdb/entities";

import RemoveCommand from "./Remove.command";

@CommandHandler(RemoveCommand)
export default class RemoveHandler implements ICommandHandler<RemoveCommand> {
  constructor(
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
  ) {}

  async execute({ id }: RemoveCommand) {
    const { affected } = await this.repository.delete(id);

    if (!affected) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Review", resourceId: id },
      });
    }
  }
}
