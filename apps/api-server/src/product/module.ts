import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import ESearchModule from "@libs/infrastructure/es/module";
import MongoQueryModule from "@libs/infrastructure/mongo/module";
import RdbCommandModule from "@libs/infrastructure/rdb/module";

import * as commands from "./application/command";
import * as queries from "./application/query";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule, RdbCommandModule, MongoQueryModule, ESearchModule],
  providers: [...Object.values(commands), ...Object.values(queries)],
  controllers: [...Object.values(controllers)],
})
export default class ProductModule {}
