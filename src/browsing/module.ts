import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import * as events from "./application/event";
import * as queries from "./application/query";

import { model_providers } from "./infrastructure/mongo/models";
import { query_repository_providers } from "./infrastructure/mongo/repositories";
import { view_repository_providers } from "./infrastructure/rdb/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule, MongooseModule.forFeature(model_providers)],
  providers: [
    ...Object.values(queries),
    ...Object.values(events),
    ...view_repository_providers,
    ...query_repository_providers,
  ],
  controllers: [...Object.values(controllers)],
  exports: [
    "IProductSummaryViewRepository",
    "IProductCatalogViewRepository",
    "ICategoryCatalogViewRepository",
    "IProductCatalogQueryRepository",
    "IProductSummaryQueryRepository",
    "ICategoryCatalogQueryRepository",
    ...Object.values(events),
  ],
})
export default class BrowsingModule {}
