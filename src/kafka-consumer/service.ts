import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";
import { Consumer, Kafka, KafkaMessage } from "kafkajs";

import { DebeziumMessage, DebeziumOperation, TableEntity, TableEntityMap } from "./dto";
import { ProductDeleteEvent, ProductUpsertEvent } from "./event";

@Injectable()
export default class KafkaConsumerService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  private readonly logger = new Logger(KafkaConsumerService.name);

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

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (topic !== "product-events" || !message.value) {
          this.logger.warn(`Invalid or null message on topic: ${topic} partition: ${partition}`);
          return;
        }

        await this.dispatch(message);
      },
    });

    this.logger.log("Kafka consumer started");
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();

    this.logger.log("Kafka consumer stopped");
  }

  async dispatch(message: KafkaMessage) {
    const { op, before, after, source } = JSON.parse(message.value!.toString()) as DebeziumMessage<
      TableEntityMap[TableEntity]
    >;

    const id = after?.id ?? before?.id;
    if (!id) return;

    switch (op) {
      case DebeziumOperation.CREATE:
      case DebeziumOperation.UPDATE:
      case DebeziumOperation.READ: {
        if (!after || !source.table) return;

        const event = new ProductUpsertEvent(source.table, after);

        await this.event_bus.publish(event);
        break;
      }
      case DebeziumOperation.DELETE: {
        const event = new ProductDeleteEvent(id);

        await this.event_bus.publish(event);
        break;
      }
    }
  }
}
