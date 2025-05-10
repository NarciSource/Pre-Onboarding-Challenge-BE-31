import { Module } from "@nestjs/common";

import * as services from "./application/services";
import { repository_providers } from "./infrastructure/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  providers: [...Object.values(services), ...repository_providers],
  controllers: [...Object.values(controllers)],
  exports: ["IProductSummaryRepository", "IProductCatalogRepository", "ICategoryCatalogRepository"],
})
export default class BrowsingModule {}
