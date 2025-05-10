import { createRepositoryProvider } from "@shared/repositories";
import { product_summary_repository_mixin } from "./repositories";
import { CategoryCatalogView, ProductCatalogView, ProductSummaryView } from "./views";

export default [
  createRepositoryProvider(
    "IProductSummaryRepository",
    ProductSummaryView,
    product_summary_repository_mixin,
  ),
  createRepositoryProvider("IProductCatalogRepository", ProductCatalogView),
  createRepositoryProvider("ICategoryCatalogRepository", CategoryCatalogView),
];
