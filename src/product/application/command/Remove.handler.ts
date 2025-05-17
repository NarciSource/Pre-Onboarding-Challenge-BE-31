import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { IBaseRepository, IQueryRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import RemoveCommand from "./Remove.command";

@CommandHandler(RemoveCommand)
export default class RemoveHandler implements ICommandHandler<RemoveCommand> {
  constructor(
    @Inject("IProductRepository")
    private readonly repository: IBaseRepository<ProductEntity>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
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
      await this.catalog_query_repository.delete(id);
    }
  }
}
