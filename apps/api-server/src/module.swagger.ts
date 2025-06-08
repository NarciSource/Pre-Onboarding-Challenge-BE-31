import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import * as product_controllers from "product/presentation/controllers";
import * as category_controllers from "category/presentation/controllers";
import * as review_controllers from "review/presentation/controllers";
import * as browsing_controllers from "browsing/presentation/controllers";

@Module({
  imports: [CqrsModule, CacheModule.register({ isGlobal: true })],
  controllers: [
    ...Object.values(product_controllers),
    ...Object.values(category_controllers),
    ...Object.values(review_controllers),
    ...Object.values(browsing_controllers),
  ],
})
export default class SwaggerAppModule {}
