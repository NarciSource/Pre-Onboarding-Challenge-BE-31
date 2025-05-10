import { Inject, Injectable } from "@nestjs/common";

import { IBrowsingRepository } from "@shared/repositories";
import { CategoryCatalogView, ProductSummaryView } from "@browsing/infrastructure/views";

@Injectable()
export default class BrowsingService {
  constructor(
    @Inject("ICategoryCatalogRepository")
    private readonly category_catalog_repository: IBrowsingRepository<CategoryCatalogView>,
    @Inject("IProductSummaryRepository")
    private readonly product_summary_repository: IBrowsingRepository<ProductSummaryView>,
  ) {}

  async find() {
    const new_products = await this.product_summary_repository.find_by_filters({
      sort_field: "created_at",
      sort_order: "DESC",
    });

    const popular_products = await this.product_summary_repository.find_by_filters({
      sort_field: "rating",
      sort_order: "DESC",
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
