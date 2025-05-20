import { createQueryRepositoryProvider } from "@shared/repositories/createQueryRepositoryProvider";
import { CategoryCatalogModel, ProductCatalogModel, ProductSummaryModel } from "../models";

export default [
  createQueryRepositoryProvider("IProductCatalogQueryRepository", ProductCatalogModel),
  createQueryRepositoryProvider("IProductSummaryQueryRepository", ProductSummaryModel),
  createQueryRepositoryProvider("ICategoryCatalogQueryRepository", CategoryCatalogModel),
];
