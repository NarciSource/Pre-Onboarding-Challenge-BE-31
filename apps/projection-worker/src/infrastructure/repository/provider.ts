import { createQueryRepositoryProvider } from "@query/repositories";

import { CategoryStateModel, TagStateModel } from "../model";

export default [
  createQueryRepositoryProvider("ICategoryStateRepository", CategoryStateModel),
  createQueryRepositoryProvider("ITagStateRepository", TagStateModel),
];
