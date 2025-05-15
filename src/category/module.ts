import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import ProductModule from "@product/module";
import BrowsingModule from "@browsing/module";

import * as queries from "./application/query";
import { repository_providers } from "./infrastructure/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule, ProductModule, BrowsingModule],
  providers: [...Object.values(queries), ...repository_providers],
  controllers: [...Object.values(controllers)],
})
export default class CategoryModule {}
