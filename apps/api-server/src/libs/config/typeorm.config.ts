import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import * as product_entities from "@product/infrastructure/rdb/entities";
import * as category_entities from "@category/infrastructure/rdb/entities";
import * as review_entities from "@review/infrastructure/rdb/entities";

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
        ...Object.values(product_entities),
        ...Object.values(category_entities),
        ...Object.values(review_entities),
      ],
      synchronize: true, // 개발
    };
  },
};
