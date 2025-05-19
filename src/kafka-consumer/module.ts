import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import BrowsingModule from "@browsing/module";
import * as events from "./event";
import KafkaConsumerService from "./service";

@Module({
  imports: [CqrsModule, BrowsingModule],
  providers: [KafkaConsumerService, ...Object.values(events)],
})
export default class KafkaConsumerModule {}
