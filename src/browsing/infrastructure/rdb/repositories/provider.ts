import { createRepositoryProvider } from "@shared/repositories";
import { CategoryCatalogView, ProductCatalogView, ProductSummaryView } from "../views";
import { product_summary_repository_mixin } from ".";

export default [
  createRepositoryProvider(
    "IProductSummaryRepository",
    ProductSummaryView,
    product_summary_repository_mixin,
  ),
  createRepositoryProvider("IProductCatalogRepository", ProductCatalogView),
  createRepositoryProvider("ICategoryCatalogRepository", CategoryCatalogView),
];
