import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Consumer, Kafka } from "kafkajs";

import { IQueryRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/rdb/entities";
import { ProductCatalogModel, ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import { DebeziumMessage, DebeziumOperation, TableEntity, TableEntityMap } from "./dto";

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

        const { op, before, after, source } = JSON.parse(
          message.value.toString(),
        ) as DebeziumMessage<TableEntityMap[TableEntity]>;

        const id = after?.id ?? before?.id;
        if (!id) return;

        switch (op) {
          case DebeziumOperation.CREATE:
          case DebeziumOperation.UPDATE:
          case DebeziumOperation.READ: {
            if (!after || !source.table) return;

            await this.handleUpsert(source.table, after);
            break;
          }
          case DebeziumOperation.DELETE: {
            await this.handleDelete(id);
            break;
          }
        }
      },
    });

    this.logger.log("Kafka consumer started");
  }

  private async handleUpsert<K extends TableEntity>(table: K, data: TableEntityMap[K]) {
    switch (table) {
      case "products": {
        const product = data as ProductEntity;

        await this.catalog_query_repository.update(data.id, product);
        await this.summary_query_repository.update(data.id, product);
        break;
      }
    }
  }

  private async handleDelete(id: number) {
    await this.catalog_query_repository.delete(id);
    await this.summary_query_repository.delete(id);
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();

    this.logger.log("Kafka consumer stopped");
  }
}
