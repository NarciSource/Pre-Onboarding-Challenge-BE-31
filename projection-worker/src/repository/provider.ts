import { createQueryRepositoryProvider } from "@query/repositories";
import { CategoryModel, TagModel } from "../model";

export default [
  createQueryRepositoryProvider("ICategoryStateRepository", CategoryModel),
  createQueryRepositoryProvider("ITagStateRepository", TagModel),
];
