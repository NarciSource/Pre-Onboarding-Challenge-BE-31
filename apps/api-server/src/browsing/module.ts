import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import MongoQueryModule from "@libs/infrastructure/mongo/module";

import * as queries from "./application/query";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule, MongoQueryModule],
  providers: [...Object.values(queries)],
  controllers: [...Object.values(controllers)],
})
export default class BrowsingModule {}
