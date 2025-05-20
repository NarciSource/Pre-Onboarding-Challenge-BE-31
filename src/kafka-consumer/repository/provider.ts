import CategoryModel from "@kafka-consumer/model/Category.model";
import { createQueryRepositoryProvider } from "@shared/repositories/createQueryRepositoryProvider";

export default [createQueryRepositoryProvider("ICategoryStateRepository", CategoryModel)];
