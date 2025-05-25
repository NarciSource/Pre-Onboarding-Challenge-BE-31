import { promises } from "fs";

import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { EntityManager } from "typeorm";
import { stringify } from "yaml";

import ProductModule from "product/module";
import CategoryModule from "category/module";
import generatorSwagger from "./generatorSwagger";

@Module({
  providers: [
    {
      provide: EntityManager,
      useValue: {},
    },
    ProductModule,
    CategoryModule,
  ],
})
class SwaggerAppModule {}

export async function openapi() {
  const app = await NestFactory.create(SwaggerAppModule);

  const document = generatorSwagger(app);

  const yamlDocument = stringify(document, { indent: 2 });

  try {
    await promises.mkdir("../../dist", { recursive: true });
  } catch (err) {
    console.error("Error creating directory", err);
    process.exit(1);
  }

  try {
    await promises.writeFile("../../dist/openapi.yaml", String(yamlDocument));
  } catch (err) {
    console.error("Error writing file", err);
    process.exit(1);
  }

  console.log("Swagger spec saved to openapi.yaml");
  process.exit(0);
}

if (require.main === module) {
  void openapi();
}
