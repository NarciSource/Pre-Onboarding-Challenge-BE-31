import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import RegisterCommand from "./Register.command";

@CommandHandler(RegisterCommand)
export default class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
  ) {}

  async execute({ product_id, dto }: RegisterCommand) {
    const created = await this.entity_manager.transaction(async (manager) => {
      const { id } = await this.repository
        .with_transaction(manager)
        .save({ product: { id: product_id }, ...dto });

      return await this.repository
        .with_transaction(manager)
        .findOne({ where: { id }, relations: ["user"] });
    });

    return created!;
  }
}
