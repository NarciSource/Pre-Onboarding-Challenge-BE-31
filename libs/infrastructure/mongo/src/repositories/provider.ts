import {
  FeaturedCategoryModel,
  NestedCategoryModel,
  ProductCatalogModel,
  ProductSummaryModel,
} from "../models";
import createQueryRepositoryProvider from "./createQueryRepositoryProvider";

export default [
  createQueryRepositoryProvider("IProductCatalogQueryRepository", ProductCatalogModel),
  createQueryRepositoryProvider("IProductSummaryQueryRepository", ProductSummaryModel),
  createQueryRepositoryProvider("IFeaturedCategoryQueryRepository", FeaturedCategoryModel),
  createQueryRepositoryProvider("INestedCategoryQueryRepository", NestedCategoryModel),
];
