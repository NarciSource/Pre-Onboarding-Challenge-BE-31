import { createRepositoryProvider } from "@shared/repositories";
import { CategoryCatalogView, ProductCatalogView, ProductSummaryView } from "../views";
import { product_summary_repository_mixin } from ".";

export default [
  createRepositoryProvider(
    "IProductSummaryViewRepository",
    ProductSummaryView,
    product_summary_repository_mixin,
  ),
  createRepositoryProvider("IProductCatalogViewRepository", ProductCatalogView),
  createRepositoryProvider("ICategoryCatalogViewRepository", CategoryCatalogView),
];
