import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { ElasticsearchModule } from "@nestjs/elasticsearch";

import { elastic_search_config } from "@libs/config";

import * as events from "./application/events";
import SyncService from "./application/service";

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env"] }),
    ElasticsearchModule.registerAsync(elastic_search_config),
  ],
  providers: [SyncService, ...Object.values(events)],
})
export default class SyncCacheModule {}
