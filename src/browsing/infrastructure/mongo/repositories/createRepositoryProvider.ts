import { Provider } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import QueryRepository from "./Query.repository";

export type MongooseDocumentClass<T extends Document> = {
  new (...args: unknown[]): T;
  name: string;
};

export function createQueryRepositoryProvider<T extends Document>(
  token: string,
  modelClass: MongooseDocumentClass<T>,
): Provider {
  return {
    provide: token,
    inject: [getModelToken(modelClass.name)],
    useFactory: (model: Model<T>) => new QueryRepository<T>(model),
  };
}
