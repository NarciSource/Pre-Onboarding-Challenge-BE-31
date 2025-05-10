import { createRepositoryProvider } from "@shared/repositories";
import { CategoryEntity } from "../entities";

export default [createRepositoryProvider("ICategoryRepository", CategoryEntity)];
