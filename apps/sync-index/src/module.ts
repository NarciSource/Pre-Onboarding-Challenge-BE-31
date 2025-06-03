import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import ESearchModule from "@libs/infrastructure/es/module";

import * as events from "./application/events";
import SyncService from "./application/service";

@Module({
  imports: [CqrsModule, ESearchModule],
  providers: [SyncService, ...Object.values(events)],
})
export default class SyncCacheModule {}
