import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Consumer, Kafka } from "kafkajs";

@Injectable()
export default class KafkaConsumerService implements OnModuleInit {
  private readonly kafka: Kafka;

  private readonly consumer: Consumer;

  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(private config: ConfigService) {
    const host = this.config.get<string>("KAFKA_HOST");
    const port = this.config.get<number>("KAFKA_PORT");

    this.kafka = new Kafka({
      brokers: [`${host}:${port}`],
    });

    this.consumer = this.kafka.consumer({
      groupId: "product-consumer",
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: "product-events",
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value === null) {
          this.logger.warn(
            `Received null message value from topic: ${topic} partition: ${partition}`,
          );
          return;
        }

        const data: unknown = JSON.parse(message.value.toString());
        this.logger.log(
          `Received message: ${JSON.stringify(data)} from topic: ${topic} partition: ${partition}`,
        );

        await Promise.resolve(true);
      },
    });

    this.logger.log("Kafka consumer started");
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();

    this.logger.log("Kafka consumer stopped");
  }
}
