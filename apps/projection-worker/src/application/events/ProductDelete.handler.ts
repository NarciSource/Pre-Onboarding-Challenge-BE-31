import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { ProductCatalogModel, ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import { IQueryRepository } from "query/domain/repositories";

import ProductDeleteEvent from "./ProductDelete.event";

@EventsHandler(ProductDeleteEvent)
export default class ProductDeleteHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async handle({ before }: ProductDeleteEvent) {
    await this.catalog_query_repository.delete({ id: before.id });

    await this.summary_query_repository.delete({ id: before.id });
  }
}
