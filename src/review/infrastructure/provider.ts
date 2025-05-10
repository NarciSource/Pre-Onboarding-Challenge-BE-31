import { createRepositoryProvider } from "@shared/repositories";
import { ReviewEntity } from "./entities";

export default [createRepositoryProvider("IReviewRepository", ReviewEntity)];
