import { Provider } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";

import QueryRepository from "./Query.repository";

export type MongooseDocumentClass<T> = {
  new (...args: unknown[]): T;
  name: string;
};

export function createQueryRepositoryProvider<T>(
  token: string,
  modelClass: MongooseDocumentClass<T>,
): Provider {
  return {
    provide: token,
    inject: [getModelToken(modelClass.name)],
    useFactory: (model: Model<T>) => new QueryRepository<T>(model),
  };
}
