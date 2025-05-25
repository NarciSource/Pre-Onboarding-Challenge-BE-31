import { createQueryRepositoryProvider } from "shared/repositories/createQueryRepositoryProvider";
import { FeaturedCategoryModel, ProductCatalogModel, ProductSummaryModel } from "../models";

export default [
  createQueryRepositoryProvider("IProductCatalogQueryRepository", ProductCatalogModel),
  createQueryRepositoryProvider("IProductSummaryQueryRepository", ProductSummaryModel),
  createQueryRepositoryProvider("IFeaturedCategoryQueryRepository", FeaturedCategoryModel),
];
