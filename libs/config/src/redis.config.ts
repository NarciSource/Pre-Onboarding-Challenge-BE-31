import { createKeyv, Keyv } from "@keyv/redis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheableMemory } from "cacheable";

export default {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const host = config.get<string>("REDIS_HOST");
    const port = config.get<string>("REDIS_PORT");

    return {
      stores: [
        new Keyv({ store: new CacheableMemory({ ttl: 60 * 1000, lruSize: 5000 }) }),
        createKeyv(`redis://${host}:${port}`),
      ],
    };
  },
};
