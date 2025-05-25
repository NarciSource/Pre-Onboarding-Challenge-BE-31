import { createRepositoryProvider } from "shared/repositories";
import {
  ProductCategoryEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductImageEntity,
  ProductOptionEntity,
  ProductOptionGroupEntity,
  ProductPriceEntity,
  ProductTagEntity,
} from "../entities";

export default [
  createRepositoryProvider("IProductRepository", ProductEntity),
  createRepositoryProvider("IProductDetailRepository", ProductDetailEntity),
  createRepositoryProvider("IProductPriceRepository", ProductPriceEntity),
  createRepositoryProvider("IProductCategoryRepository", ProductCategoryEntity),
  createRepositoryProvider("IProductOptionsRepository", ProductOptionEntity),
  createRepositoryProvider("IProductOptionGroupRepository", ProductOptionGroupEntity),
  createRepositoryProvider("IProductImageRepository", ProductImageEntity),
  createRepositoryProvider("IProductTagRepository", ProductTagEntity),
];
