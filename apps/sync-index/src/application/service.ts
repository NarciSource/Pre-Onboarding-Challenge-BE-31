import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";
import { Consumer, Kafka, KafkaMessage } from "kafkajs";

import { ProductSummaryDocs } from "../infrastructure";
import { SummarySyncEvent } from "./events";

@Injectable()
export default class SyncService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly event_bus: EventBus,
  ) {
    const host = this.config.get<string>("KAFKA_HOST");
    const port = this.config.get<number>("KAFKA_PORT");

    this.kafka = new Kafka({ brokers: [`${host}:${port}`] });
    this.consumer = this.kafka.consumer({ groupId: "summary-consumers" });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: "mongo_connector.db.productsummarymodels",
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) {
          this.logger.warn(`Invalid or null message on topic: ${topic} partition: ${partition}`);
          return;
        }

        await this.dispatch(topic, message);
      },
    });

    this.logger.log("Kafka consumer started");
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();

    this.logger.log("Kafka consumer stopped");
  }

  async dispatch(topic: string, message: KafkaMessage) {
    const docs = JSON.parse(message.value!.toString()) as ProductSummaryDocs;

    const event = new SummarySyncEvent(topic, docs);

    await this.event_bus.publish(event);
  }
}
