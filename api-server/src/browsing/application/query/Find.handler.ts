import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@shared/repositories";
import { CategoryCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import FindQuery from "./Find.query";

@QueryHandler(FindQuery)
export default class FindHandler implements IQueryHandler<FindQuery> {
  constructor(
    @Inject("IProductSummaryQueryRepository")
    private readonly product_summary_query_repository: IQueryRepository<ProductSummaryModel>,
    @Inject("ICategoryCatalogQueryRepository")
    private readonly category_catalog_repository: IQueryRepository<CategoryCatalogModel>,
  ) {}

  async execute() {
    const new_products = await this.product_summary_query_repository.find({
      order: { created_at: "DESC" },
    });

    const popular_products = await this.product_summary_query_repository.find({
      order: { rating: "DESC" },
    });

    const featured_categories = await this.category_catalog_repository.find({
      order: { product_count: "DESC" },
      take: 5,
    });

    return {
      new_products,
      popular_products,
      featured_categories,
    };
  }
}
