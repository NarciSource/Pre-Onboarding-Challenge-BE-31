import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import MongoQueryModule from "@libs/infrastructure/mongo/module";

import ProductModule from "product/module";
import * as queries from "./application/query";
import { repository_providers } from "./infrastructure/rdb/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule, ProductModule, MongoQueryModule],
  providers: [...Object.values(queries), ...repository_providers],
  controllers: [...Object.values(controllers)],
})
export default class CategoryModule {}
