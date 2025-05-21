import { Inject, NotFoundException } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository, IViewRepository } from "@shared/repositories";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/rdb/views";
import QueryUpdateEvent from "./QueryUpdate.event";

@EventsHandler(QueryUpdateEvent)
export default class QueryUpdateHandler {
  constructor(
    @Inject("IProductCatalogViewRepository")
    private readonly product_catalog_view_repository: IViewRepository<ProductCatalogView>,
    @Inject("IProductSummaryViewRepository")
    private readonly product_summary_view_repository: IViewRepository<ProductSummaryView>,

    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ id }: QueryUpdateEvent): Promise<void> {
    {
      {
        const catalog = await this.product_catalog_view_repository.findOneBy({ id });

        if (!catalog) {
          throw new NotFoundException({
            message: "상품 카탈로그를 찾을 수 없습니다.",
            details: { resourceType: "ProductCatalog", resourceId: id },
          });
        }

        await this.catalog_query_repository.updateOne({ id }, catalog);
      }

      {
        const summary = await this.product_summary_view_repository.findOneBy({ id });

        if (!summary) {
          throw new NotFoundException({
            message: "상품 요약 정보를 찾을 수 없습니다.",
            details: { resourceType: "ProductSummary", resourceId: id },
          });
        }

        await this.summary_query_repository.updateOne({ id }, summary);
      }
    }
  }
}
