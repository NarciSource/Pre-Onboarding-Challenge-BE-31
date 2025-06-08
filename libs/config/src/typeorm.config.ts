import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import * as rdb_entities from "@libs/infrastructure/rdb/entities";

export default {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => {
    const host = config.get<string>("PG_HOST");
    const port = config.get<number>("PG_PORT");
    const username = config.get<string>("PG_USERNAME");
    const password = config.get<string>("PG_PASSWORD");
    const database = config.get<string>("PG_DATABASE");

    return {
      type: "postgres",
      host,
      port,
      username,
      password,
      database,
      entities: [...Object.values(rdb_entities)],
      synchronize: true, // 개발
    };
  },
};
