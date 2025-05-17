import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@shared/repositories";
import { ProductCatalogModel } from "@browsing/infrastructure/mongo/models";
import QueryRemoveEvent from "./QueryRemove.event";

@EventsHandler(QueryRemoveEvent)
export default class QueryRemoveHandler {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async handle({ id }: QueryRemoveEvent): Promise<void> {
    {
      await this.catalog_query_repository.delete(id);
    }
  }
}
