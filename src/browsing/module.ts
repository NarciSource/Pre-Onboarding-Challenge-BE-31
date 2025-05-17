import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import * as queries from "./application/query";
import ProductCatalogModel, {
  ProductCatalogSchema,
} from "./infrastructure/mongo/models/ProductCatalog.model";
import CatalogRepository from "./infrastructure/mongo/repositories/Catalog.repository";
import { repository_providers } from "./infrastructure/rdb/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ProductCatalogModel.name,
        schema: ProductCatalogSchema,
      },
    ]),
  ],
  providers: [
    ...Object.values(queries),
    ...repository_providers,
    {
      provide: "ICatalogQueryRepository",
      useClass: CatalogRepository,
    },
  ],
  controllers: [...Object.values(controllers)],
  exports: [
    "IProductSummaryRepository",
    "IProductCatalogRepository",
    "ICategoryCatalogRepository",
    CatalogRepository,
  ],
})
export default class BrowsingModule {}
