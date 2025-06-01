import { NestFactory } from "@nestjs/core";

import SyncCacheModule from "./module";

async function bootstrap() {
  const app = await NestFactory.create(SyncCacheModule);

  await app.listen(process.env.SYNC_PORT ?? 3002);
}
void bootstrap();
