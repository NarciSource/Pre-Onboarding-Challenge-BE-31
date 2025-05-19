import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Consumer, Kafka } from "kafkajs";

import { IQueryRepository } from "@shared/repositories";
import {
  ProductCategoryEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductOptionGroupEntity,
  ProductPriceEntity,
  ProductTagEntity,
} from "@product/infrastructure/rdb/entities";
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
      case "product_details": {
        const { product_id, ...detail } = data as ProductDetailEntity;

        await this.catalog_query_repository.update(product_id, { detail });
        break;
      }
      case "product_categories": {
        const { product_id, category_id, is_primary } = data as ProductCategoryEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const categories = catalog?.categories ?? [];

        const updated_categories = [
          ...categories.filter((c) => c?.id !== category_id),
          { id: category_id, is_primary },
        ];

        await this.catalog_query_repository.update(product_id, {
          categories: updated_categories,
        });
        break;
      }
      case "product_prices": {
        const { product_id, ...price } = data as ProductPriceEntity;

        const discount_percentage =
          ((price.base_price - (price.sale_price ?? 0)) * 100) / price.base_price;

        await this.catalog_query_repository.update(product_id, {
          price: { ...price, discount_percentage },
        });
        await this.summary_query_repository.update(product_id, price);
        break;
      }
      case "product_option_groups": {
        const { id, product_id, name, display_order } = data as ProductOptionGroupEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const option_group = catalog?.option_groups ?? [];

        const updated_option_groups = [
          ...option_group.filter((og) => og?.id !== id),
          { id, name, display_order },
        ];

        await this.catalog_query_repository.update(product_id, {
          option_groups: updated_option_groups,
        });
        break;
      }
      case "product_tags": {
        const { product_id, tag_id } = data as ProductTagEntity;

        const catalog = await this.catalog_query_repository.findOneBy({ id: product_id });
        const tags = catalog?.tags ?? [];

        const updated_tags = [...tags.filter((t) => t?.id !== tag_id), { id: tag_id }];

        await this.catalog_query_repository.update(product_id, {
          tags: updated_tags,
        });
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
