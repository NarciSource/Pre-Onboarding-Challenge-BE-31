import { join } from "path";

import { TypeOrmModuleOptions } from "@nestjs/typeorm";

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
      entities: [
        join(process.cwd(), "../", "**", "*.entity.js"),
        join(process.cwd(), "../", "**", "*.view.js"),
      ],
      synchronize: true, // 개발
    };
  },
};
