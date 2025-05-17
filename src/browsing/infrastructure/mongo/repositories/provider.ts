import { CategoryCatalogModel, ProductCatalogModel, ProductSummaryModel } from "../models";
import { createQueryRepositoryProvider } from "./createRepositoryProvider";

export default [
  createQueryRepositoryProvider("IProductCatalogQueryRepository", ProductCatalogModel),
  createQueryRepositoryProvider("IProductSummaryQueryRepository", ProductSummaryModel),
  createQueryRepositoryProvider("ICategoryCatalogQueryRepository", CategoryCatalogModel),
];
