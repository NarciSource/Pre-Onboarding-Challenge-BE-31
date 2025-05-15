import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import * as commands from "./application/command";
import * as queries from "./application/query";
import { repository_providers } from "./infrastructure/repositories";
import * as controllers from "./presentation/controllers";

@Module({
  imports: [CqrsModule],
  providers: [...Object.values(commands), ...Object.values(queries), ...repository_providers],
  controllers: [...Object.values(controllers)],
})
export default class ReviewModule {}
