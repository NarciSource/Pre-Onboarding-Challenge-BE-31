import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import * as rdb_entities from "@libs/infrastructure/rdb/entities";

export default {
  useFactory: (): TypeOrmModuleOptions => {
    const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE } = process.env;

    return {
      type: "postgres",
      host: PG_HOST,
      port: Number(PG_PORT),
      username: PG_USERNAME,
      password: PG_PASSWORD,
      database: PG_DATABASE,
      entities: [...Object.values(rdb_entities)],
      synchronize: true, // 개발
    };
  },
};
