import { NestFactory } from "@nestjs/core";

import KafkaConsumerModule from "./module";

async function bootstrap() {
  const app = await NestFactory.create(KafkaConsumerModule);

  await app.listen(process.env.WORKER_PORT ?? 3001);
}
void bootstrap();
