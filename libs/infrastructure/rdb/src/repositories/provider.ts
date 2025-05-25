import {
  CategoryEntity,
  ProductCategoryEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductImageEntity,
  ProductOptionEntity,
  ProductOptionGroupEntity,
  ProductPriceEntity,
  ProductTagEntity,
  ReviewEntity,
  UserEntity,
} from "../entities";
import createRepositoryProvider from "./createRepositoryProvider";

export default [
  createRepositoryProvider("IProductRepository", ProductEntity),
  createRepositoryProvider("IProductDetailRepository", ProductDetailEntity),
  createRepositoryProvider("IProductPriceRepository", ProductPriceEntity),
  createRepositoryProvider("IProductCategoryRepository", ProductCategoryEntity),
  createRepositoryProvider("IProductOptionsRepository", ProductOptionEntity),
  createRepositoryProvider("IProductOptionGroupRepository", ProductOptionGroupEntity),
  createRepositoryProvider("IProductImageRepository", ProductImageEntity),
  createRepositoryProvider("IProductTagRepository", ProductTagEntity),

  createRepositoryProvider("ICategoryRepository", CategoryEntity),

  createRepositoryProvider("IReviewRepository", ReviewEntity),
  createRepositoryProvider("IUserRepository", UserEntity),
];
