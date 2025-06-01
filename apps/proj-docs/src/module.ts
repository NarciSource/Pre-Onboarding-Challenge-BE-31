import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { mongo_config } from "@libs/config";
import { model_providers } from "@libs/infrastructure/mongo/models";
import { repository_providers } from "@libs/infrastructure/mongo/repositories";

import * as events from "./application/events";
import ProjectionService from "./application/service";
import { model_providers as state_model_providers } from "./infrastructure/model";
import state_repository_providers from "./infrastructure/repository/provider";

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env"] }),
    MongooseModule.forRootAsync(mongo_config),
    MongooseModule.forFeature([...model_providers, ...state_model_providers]),
  ],
  providers: [
    ProjectionService,
    ...Object.values(events),
    ...repository_providers,
    ...state_repository_providers,
  ],
})
export default class ProjectionDocsModule {}
