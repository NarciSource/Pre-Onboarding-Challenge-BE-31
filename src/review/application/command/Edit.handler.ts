import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository, IQueryRepository, IViewRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView } from "@browsing/infrastructure/rdb/views";
import EditCommand from "./Edit.command";

@CommandHandler(EditCommand)
export default class EditHandler implements ICommandHandler<EditCommand> {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IReviewRepository")
    private readonly repository: IBaseRepository<ReviewEntity>,
    @Inject("IProductCatalogViewRepository")
    private readonly catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
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
        .findOne({ where: { id: review_id }, relations: { product: true } });

      {
        /**
         * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
         */
        const catalog = await this.catalog_view_repository.with_transaction(manager).findOneBy({
          id: updated?.product.id,
        });

        if (!catalog) {
          throw new NotFoundException({
            message: "상품 카탈로그를 찾을 수 없습니다.",
            details: { resourceType: "ProductCatalog", resourceId: updated?.product.id },
          });
        }

        if (updated?.product.id) {
          await this.catalog_query_repository.update(updated?.product.id, catalog);
        }
      }
    });

    const { id, rating, title, content, updated_at } = updated!;
    return { id, rating, title, content, updated_at };
  }
}
