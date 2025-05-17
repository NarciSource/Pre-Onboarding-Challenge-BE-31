import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository, IQueryRepository, IViewRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView } from "@browsing/infrastructure/rdb/views";
import RegisterCommand from "./Register.command";

@CommandHandler(RegisterCommand)
export default class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
    @Inject("IProductCatalogViewRepository")
    private readonly catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async execute({ product_id, dto }: RegisterCommand) {
    const created = await this.entity_manager.transaction(async (manager) => {
      const { id } = await this.repository
        .with_transaction(manager)
        .save({ product: { id: product_id }, ...dto });

      const created = await this.repository
        .with_transaction(manager)
        .findOne({ where: { id }, relations: ["user"] });

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

      return created;
    });

    return created!;
  }
}
