import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import * as queries from "./application/query";
import { repository_providers } from "./infrastructure/rdb/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule],
  providers: [...Object.values(queries), ...repository_providers],
  controllers: [...Object.values(controllers)],
  exports: [
    "IProductSummaryViewRepository",
    "IProductCatalogViewRepository",
    "ICategoryCatalogViewRepository",
  ],
})
export default class BrowsingModule {}
