import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongoDBContainer, StartedMongoDBContainer } from "@testcontainers/mongodb";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DataSource } from "typeorm";

import * as product_commands from "@product/application/command";
import * as product_queries from "@product/application/query";
import * as product_entities from "@product/infrastructure/rdb/entities";
import { repository_providers as product_repository_providers } from "@product/infrastructure/rdb/repositories";
import * as product_controllers from "@product/presentation/controllers";

import * as category_queries from "@category/application/query";
import * as category_entities from "@category/infrastructure/rdb/entities";
import { repository_providers as category_repository_providers } from "@category/infrastructure/rdb/repositories";
import * as category_controllers from "@category/presentation/controllers";

import * as review_commands from "@review/application/command";
import * as review_queries from "@review/application/query";
import * as review_entities from "@review/infrastructure/rdb/entities";
import { repository_providers as review_repository_providers } from "@review/infrastructure/rdb/repositories";
import * as review_controllers from "@review/presentation/controllers";

import * as browsing_queries from "@browsing/application/query";
import { model_providers } from "@browsing/infrastructure/mongo/models";
import query_repository_providers from "@browsing/infrastructure/mongo/repositories/provider";
import view_repository_providers from "@browsing/infrastructure/rdb/repositories/provider";
import * as views from "@browsing/infrastructure/rdb/views";
import * as browsing_controllers from "@browsing/presentation/controllers";

let postgres_container: StartedPostgreSqlContainer;
let mongo_container: StartedMongoDBContainer;
let test_module: TestingModule;

export async function get_module() {
  if (test_module) {
    return test_module;
  }
  postgres_container = await new PostgreSqlContainer()
    .withDatabase("testdb")
    .withUsername("testuser")
    .withPassword("testpassword")
    .start();

  mongo_container = await new MongoDBContainer().start();

  test_module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: "postgres",
          host: postgres_container.getHost(),
          port: postgres_container.getPort(),
          username: postgres_container.getUsername(),
          password: postgres_container.getPassword(),
          database: postgres_container.getDatabase(),
          entities: [
            ...Object.values(product_entities),
            ...Object.values(category_entities),
            ...Object.values(review_entities),
            ...Object.values(views),
          ],
          synchronize: true,
        }),
      }),
      TypeOrmModule.forFeature([
        ...Object.values(product_entities),
        ...Object.values(category_entities),
        ...Object.values(review_entities),
        ...Object.values(views),
      ]),
      MongooseModule.forRootAsync({
        useFactory: () => {
          return { uri: mongo_container.getConnectionString() };
        },
      }),
      MongooseModule.forFeature(model_providers),
    ],
    providers: [
      {
        provide: EventBus,
        useValue: { publish: jest.fn() },
      },
      {
        provide: CommandBus,
        useValue: { execute: jest.fn() },
      },
      {
        provide: QueryBus,
        useValue: { execute: jest.fn() },
      },
      ...product_repository_providers,
      ...category_repository_providers,
      ...review_repository_providers,
      ...view_repository_providers,
      ...query_repository_providers,
      ...Object.values(product_commands),
      ...Object.values(product_queries),
      ...Object.values(review_commands),
      ...Object.values(review_queries),
      ...Object.values(category_queries),
      ...Object.values(browsing_queries),
    ],
    controllers: [
      ...Object.values(product_controllers),
      ...Object.values(category_controllers),
      ...Object.values(review_controllers),
      ...Object.values(browsing_controllers),
    ],
  }).compile();

  return test_module;
}

export async function stop_test_module() {
  if (test_module) {
    const dataSource = test_module.get<DataSource>(DataSource);
    await dataSource.destroy();
  }
  if (postgres_container) {
    await postgres_container.stop();
  }
}
