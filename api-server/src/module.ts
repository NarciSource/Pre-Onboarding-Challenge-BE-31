import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";

import { mongo_config, type_orm_config } from "@libs/config";
import ProductModule from "@product/module";
import CategoryModule from "@category/module";
import ReviewModule from "@review/module";
import BrowsingModule from "@browsing/module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../.env"],
    }),
    TypeOrmModule.forRootAsync(type_orm_config),
    MongooseModule.forRootAsync(mongo_config),
    ProductModule,
    CategoryModule,
    ReviewModule,
    BrowsingModule,
  ],
})
export class AppModule {}
