import { CategoryModel, TagModel } from "@kafka-consumer/model";
import { createQueryRepositoryProvider } from "@shared/repositories/createQueryRepositoryProvider";

export default [
  createQueryRepositoryProvider("ICategoryStateRepository", CategoryModel),
  createQueryRepositoryProvider("ITagStateRepository", TagModel),
];
