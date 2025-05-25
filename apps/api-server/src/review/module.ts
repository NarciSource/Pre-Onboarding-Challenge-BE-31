import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import BrowsingModule from "browsing/module";
import * as commands from "./application/command";
import * as queries from "./application/query";
import { repository_providers } from "./infrastructure/rdb/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule, BrowsingModule],
  providers: [...Object.values(commands), ...Object.values(queries), ...repository_providers],
  controllers: [...Object.values(controllers)],
})
export default class ReviewModule {}
