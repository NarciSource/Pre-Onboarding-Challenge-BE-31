import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";
import { Consumer, Kafka, KafkaMessage } from "kafkajs";

import TableEntityMap, { DebeziumMessage, TableEntity } from "./TableEntityMap";
import topicEventMap, { TopicName } from "./topicEventMap";

@Injectable()
export default class ProjectionService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  private readonly logger = new Logger(ProjectionService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly event_bus: EventBus,
  ) {
    const host = this.config.get<string>("KAFKA_HOST");
    const port = this.config.get<number>("KAFKA_PORT");

    this.kafka = new Kafka({ brokers: [`${host}:${port}`] });
    this.consumer = this.kafka.consumer({ groupId: "product-consumer" });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "product-events", fromBeginning: true });
    await this.consumer.subscribe({ topic: "product-option-events", fromBeginning: true });
    await this.consumer.subscribe({ topic: "merchant-events", fromBeginning: true });
    await this.consumer.subscribe({ topic: "review-events", fromBeginning: true });
    await this.consumer.subscribe({ topic: "category-events", fromBeginning: true });
    await this.consumer.subscribe({ topic: "tag-events", fromBeginning: true });

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

  async dispatch(topic: TopicName, message: KafkaMessage) {
    const { op, before, after, source } = JSON.parse(message.value!.toString()) as DebeziumMessage<
      TableEntityMap[TableEntity]
    >;

    const EventClass = topicEventMap[topic][op];
    if (!EventClass) {
      this.logger.warn(`No EventClass found for topic: ${topic}, op: ${op}`);
      return;
    }

    const event = new EventClass(source.table, before, after);

    await this.event_bus.publish(event);
  }
}
