import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";

import * as events from "./application/events";
import SyncService from "./application/service";

@Module({
  imports: [CqrsModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env"] })],
  providers: [SyncService, ...Object.values(events)],
})
export default class SyncCacheModule {}
