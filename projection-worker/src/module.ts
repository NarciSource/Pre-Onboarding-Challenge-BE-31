import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { mongo_config } from "@query/config";
import { BrowsingModule } from "@query/module";
import * as events from "./event";
import { model_providers } from "./model";
import state_repository_providers from "./repository/provider";
import KafkaConsumerService from "./service";

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../.env"],
    }),
    MongooseModule.forRootAsync(mongo_config),
    MongooseModule.forFeature(model_providers),
    BrowsingModule,
  ],
  providers: [KafkaConsumerService, ...Object.values(events), ...state_repository_providers],
})
export default class KafkaConsumerModule {}
