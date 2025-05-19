import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Consumer, Kafka } from "kafkajs";

import { IQueryRepository } from "@shared/repositories";
import {
  ProductCategoryEntity,
  ProductEntity,
  ProductPriceEntity,
} from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import { DebeziumMessage, DebeziumOperation } from "./dto";

@Injectable()
export default class KafkaConsumerService implements OnModuleInit {
  private readonly kafka: Kafka;

  private readonly consumer: Consumer;

  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(
    private config: ConfigService,

    @Inject("IProductCatalogQueryRepository")
    private readonly catalog_query_repository: IQueryRepository<ProductCatalogModel>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_query_repository: IQueryRepository<ProductSummaryModel>,
  ) {
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
        if (topic === "product-events") {
          if (message.value === null) {
            this.logger.warn(
              `Received null message value from topic: ${topic} partition: ${partition}`,
            );
            return;
          }

          const { op, before, after, source } = JSON.parse(
            message.value.toString(),
          ) as DebeziumMessage<ProductEntity | ProductPriceEntity | ProductCategoryEntity>;

          switch (op) {
            case DebeziumOperation.CREATE:
            case DebeziumOperation.UPDATE:
            case DebeziumOperation.READ:
              switch (source.table) {
                case "products":
                  if (after) {
                    await this.catalog_query_repository.update(after.id, after);

                    await this.summary_query_repository.update(after.id, after);
                  }
                  break;
              }
              break;
            case DebeziumOperation.DELETE:
              switch (source.table) {
                case "products":
                  if (before) {
                    await this.catalog_query_repository.delete(before.id);

                    await this.summary_query_repository.delete(before.id);
                  }
                  break;
              }
          }
        }
      },
    });

    this.logger.log("Kafka consumer started");
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();

    this.logger.log("Kafka consumer stopped");
  }
}
