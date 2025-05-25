import { createQueryRepositoryProvider } from "@libs/infrastructure/mongo/repositories";

import { CategoryStateModel, TagStateModel } from "../model";

export default [
  createQueryRepositoryProvider("ICategoryStateRepository", CategoryStateModel),
  createQueryRepositoryProvider("ITagStateRepository", TagStateModel),
];
