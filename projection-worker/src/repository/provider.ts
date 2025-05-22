import { createQueryRepositoryProvider } from "@shared/repositories/createQueryRepositoryProvider";
import { CategoryModel, TagModel } from "../model";

export default [
  createQueryRepositoryProvider("ICategoryStateRepository", CategoryModel),
  createQueryRepositoryProvider("ITagStateRepository", TagModel),
];
