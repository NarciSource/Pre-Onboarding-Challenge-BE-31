import { Module } from "@nestjs/common";

import BrowsingModule from "@browsing/module";
import KafkaConsumerService from "./service";

@Module({
  imports: [BrowsingModule],
  providers: [KafkaConsumerService],
})
export default class KafkaConsumerModule {}
