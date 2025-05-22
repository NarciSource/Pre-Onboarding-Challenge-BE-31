import {
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { ProductOptionEntity } from "@product/infrastructure/rdb/entities";
import OptionRemoveCommand from "./OptionRemove.command";

@CommandHandler(OptionRemoveCommand)
export default class OptionRemoveHandler implements ICommandHandler<OptionRemoveCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IProductOptionsRepository")
    private readonly repository: IBaseRepository<ProductOptionEntity>,
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

      return affected !== 0;
    });

    if (!delete_success) {
      throw new InternalServerErrorException("옵션 삭제에 실패했습니다.");
    }
  }
}
