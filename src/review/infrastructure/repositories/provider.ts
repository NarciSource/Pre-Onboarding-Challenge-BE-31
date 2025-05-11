import { createRepositoryProvider } from "@shared/repositories";
import { ReviewEntity, UserEntity } from "../entities";

export default [
  createRepositoryProvider("IReviewRepository", ReviewEntity),
  createRepositoryProvider("IUserRepository", UserEntity),
];
