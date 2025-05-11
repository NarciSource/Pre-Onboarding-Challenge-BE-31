import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DataSource } from "typeorm";

import * as product_services from "@product/application/services";
import * as product_entities from "@product/infrastructure/entities";
import { repository_providers as product_repository_providers } from "@product/infrastructure/repositories";
import * as product_controllers from "@product/presentation/controllers";

import * as category_services from "@category/application/services";
import * as category_entities from "@category/infrastructure/entities";
import { repository_providers as category_repository_providers } from "@category/infrastructure/repositories";
import * as category_controllers from "@category/presentation/controllers";

import * as review_services from "@review/application/services";
import * as review_entities from "@review/infrastructure/entities";
import { repository_providers as review_repository_providers } from "@review/infrastructure/repositories";
import * as review_controllers from "@review/presentation/controllers";

import * as browsing_services from "@browsing/application/services";
import browsing_repository_providers from "@browsing/infrastructure/repositories/provider";
import * as views from "@browsing/infrastructure/views";
import * as browsing_controllers from "@browsing/presentation/controllers";

let container: StartedPostgreSqlContainer;
let test_module: TestingModule;

export async function get_module() {
  if (test_module) {
    return test_module;
  }
  container = await new PostgreSqlContainer()
    .withDatabase("testdb")
    .withUsername("testuser")
    .withPassword("testpassword")
    .start();

  test_module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: "postgres",
          host: container.getHost(),
          port: container.getPort(),
          username: container.getUsername(),
          password: container.getPassword(),
          database: container.getDatabase(),
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
    ],
    providers: [
      ...product_repository_providers,
      ...category_repository_providers,
      ...review_repository_providers,
      ...browsing_repository_providers,
      ...Object.values(product_services),
      ...Object.values(review_services),
      ...Object.values(category_services),
      ...Object.values(browsing_services),
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
  if (container) {
    await container.stop();
  }
}
