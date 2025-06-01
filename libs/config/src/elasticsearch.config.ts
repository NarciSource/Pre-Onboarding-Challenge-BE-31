import { ConfigModule, ConfigService } from "@nestjs/config";

export default {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const host = config.get<string>("ES_HOST", "localhost");
    const port = config.get<number>("ES_PORT", 9200);
    const username = config.get<string>("ES_USERNAME", "user");
    const password = config.get<string>("ES_PASSWORD", "password");

    return {
      node: `http://${host}:${port}`,
      auth: { username, password },
    };
  },
};
