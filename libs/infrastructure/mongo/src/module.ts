import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { model_providers } from "./models";
import { repository_providers } from "./repositories";

@Module({
  imports: [MongooseModule.forFeature(model_providers)],
  providers: [...repository_providers],
  exports: [
    "IProductCatalogQueryRepository",
    "IProductSummaryQueryRepository",
    "IFeaturedCategoryQueryRepository",
  ],
})
export default class MongoQueryModule {}
