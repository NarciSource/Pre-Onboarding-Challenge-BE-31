import { NestFactory } from "@nestjs/core";

import ProjectionDocsModule from "./module";

async function bootstrap() {
  const app = await NestFactory.create(ProjectionDocsModule);

  await app.listen(process.env.PROJECTOR_PORT ?? 3001);
}
void bootstrap();
