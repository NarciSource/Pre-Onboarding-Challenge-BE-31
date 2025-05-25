import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import { model_providers } from "@libs/infrastructure/mongo/models";

import * as product_commands from "product/application/command";
import * as product_queries from "product/application/query";
import * as product_entities from "product/infrastructure/rdb/entities";
import { repository_providers as product_repository_providers } from "product/infrastructure/rdb/repositories";
import * as product_controllers from "product/presentation/controllers";

import * as category_queries from "category/application/query";
import * as category_entities from "category/infrastructure/rdb/entities";
import { repository_providers as category_repository_providers } from "category/infrastructure/rdb/repositories";
import * as category_controllers from "category/presentation/controllers";

import * as review_commands from "review/application/command";
import * as review_queries from "review/application/query";
import * as review_entities from "review/infrastructure/rdb/entities";
import { repository_providers as review_repository_providers } from "review/infrastructure/rdb/repositories";
import * as review_controllers from "review/presentation/controllers";

import * as browsing_queries from "browsing/application/query";
import query_repository_providers from "@libs/infrastructure/mongo/repositories/provider";
import * as browsing_controllers from "browsing/presentation/controllers";

const test_module = Test.createTestingModule({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host: process.env.TEST_POSTGRES_HOST,
        port: Number(process.env.TEST_POSTGRES_PORT),
        username: process.env.TEST_POSTGRES_USERNAME,
        password: process.env.TEST_POSTGRES_PASSWORD,
        database: process.env.TEST_POSTGRES_DB,
        entities: [
          ...Object.values(product_entities),
          ...Object.values(category_entities),
          ...Object.values(review_entities),
        ],
      }),
    }),
    TypeOrmModule.forFeature([
      ...Object.values(product_entities),
      ...Object.values(category_entities),
      ...Object.values(review_entities),
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return { uri: `${process.env.TEST_MONGO_URI}?directConnection=true` };
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

export default test_module;
