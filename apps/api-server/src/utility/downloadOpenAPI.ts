import { promises } from "fs";

import { NestFactory } from "@nestjs/core";
import { stringify } from "yaml";

import SwaggerAppModule from "../module.swagger";
import generatorSwagger from "./generatorSwagger";

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
