import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IViewRepository } from "@shared/repositories";
import { CategoryCatalogView, ProductSummaryView } from "@browsing/infrastructure/rdb/views";
import FindQuery from "./Find.query";

@QueryHandler(FindQuery)
export default class FindHandler implements IQueryHandler<FindQuery> {
  constructor(
    @Inject("ICategoryCatalogViewRepository")
    private readonly category_catalog_repository: IViewRepository<CategoryCatalogView>,
    @Inject("IProductSummaryViewRepository")
    private readonly product_summary_repository: IViewRepository<ProductSummaryView>,
  ) {}

  async execute() {
    const new_products = await this.product_summary_repository.find({
      order: { created_at: "DESC" },
    });

    const popular_products = await this.product_summary_repository.find({
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
