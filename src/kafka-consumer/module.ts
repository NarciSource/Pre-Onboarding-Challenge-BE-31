import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import BrowsingModule from "@browsing/module";
import * as events from "./event";
import { model_providers } from "./model";
import { state_repository_providers } from "./repository";
import KafkaConsumerService from "./service";

@Module({
  imports: [CqrsModule, MongooseModule.forFeature(model_providers), BrowsingModule],
  providers: [KafkaConsumerService, ...Object.values(events), ...state_repository_providers],
})
export default class KafkaConsumerModule {}
