import { Module } from "@nestjs/common";

import { repository_providers } from "./repositories";

@Module({
  providers: [...repository_providers],
  exports: [
    "IProductRepository",
    "IProductDetailRepository",
    "IProductPriceRepository",
    "IProductCategoryRepository",
    "IProductOptionsRepository",
    "IProductOptionGroupRepository",
    "IProductImageRepository",
    "IProductTagRepository",

    "ICategoryRepository",

    "IReviewRepository",
    "IUserRepository",
  ],
})
export default class RdbCommandModule {}
