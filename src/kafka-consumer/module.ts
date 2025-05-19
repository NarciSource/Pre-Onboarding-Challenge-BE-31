import { Module } from "@nestjs/common";
import KafkaConsumerService from "./service";

@Module({
  imports: [],
  providers: [KafkaConsumerService],
})
export default class KafkaConsumerModule {}
