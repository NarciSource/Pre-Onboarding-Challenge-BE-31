import { ConfigModule, ConfigService } from "@nestjs/config";

export default {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const host = config.get<string>("MONGO_HOST");
    const port = config.get<string>("MONGO_PORT");
    const db = config.get<string>("MONGO_DATABASE");

    return {
      uri: `mongodb://${host}:${port}/${db}`,
    };
  },
};
