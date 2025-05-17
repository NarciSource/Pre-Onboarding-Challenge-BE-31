import { Inject, NotFoundException } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository, IViewRepository } from "@shared/repositories";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView } from "@browsing/infrastructure/rdb/views";
import QueryUpdateEvent from "./QueryUpdate.event";

@EventsHandler(QueryUpdateEvent)
export default class QueryUpdateHandler {
  constructor(
    @Inject("IProductCatalogViewRepository")
    private readonly catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async handle({ id, manager }: QueryUpdateEvent): Promise<void> {
    {
      /**
       * 커맨드 뷰 레포지토리에서 쿼리 레포지토리로 수동 업데이트
       */
      let catalog: ProductCatalogView | null = null;
      if (manager) {
        catalog = await this.catalog_view_repository.with_transaction(manager).findOneBy({ id });
      } else {
        catalog = await this.catalog_view_repository.findOneBy({ id });
      }

      if (!catalog) {
        throw new NotFoundException({
          message: "상품 카탈로그를 찾을 수 없습니다.",
          details: { resourceType: "ProductCatalog", resourceId: id },
        });
      }

      await this.catalog_query_repository.update(id, catalog);
    }
  }
}
