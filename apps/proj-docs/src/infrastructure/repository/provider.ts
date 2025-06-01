import { createQueryRepositoryProvider } from "@libs/infrastructure/mongo/repositories";

import { BrandStateModel, CategoryStateModel, SellerStateModel, TagStateModel } from "../model";

export default [
  createQueryRepositoryProvider("IBrandStateRepository", BrandStateModel),
  createQueryRepositoryProvider("ISellerStateRepository", SellerStateModel),
  createQueryRepositoryProvider("ICategoryStateRepository", CategoryStateModel),
  createQueryRepositoryProvider("ITagStateRepository", TagStateModel),
];
