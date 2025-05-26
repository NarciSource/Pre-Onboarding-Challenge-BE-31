import { EventBus } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";

import { model_providers as query_model_providers } from "@libs/infrastructure/mongo/models";
import { repository_providers as query_repository_providers } from "@libs/infrastructure/mongo/repositories";

import * as events from "../application/events";
import { model_providers } from "../infrastructure/model";
import { state_repository_providers } from "../infrastructure/repository";

const test_module = Test.createTestingModule({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        return { uri: `${process.env.TEST_MONGO_URI}?directConnection=true` };
      },
    }),
    MongooseModule.forFeature([...query_model_providers, ...model_providers]),
  ],
  providers: [
    {
      provide: EventBus,
      useValue: { publish: jest.fn() },
    },
    ...state_repository_providers,
    ...query_repository_providers,
    ...Object.values(events),
  ],
}).compile();

export default test_module;
