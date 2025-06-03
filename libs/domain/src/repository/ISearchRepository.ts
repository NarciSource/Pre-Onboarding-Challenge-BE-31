import { Client } from "@elastic/elasticsearch";
import { OnModuleInit } from "@nestjs/common";

export type Query = NonNullable<Parameters<Client["search"]>[0]>["query"];
export type Mapping = Parameters<Client["indices"]["create"]>[0]["mappings"];

export default interface ISearchRepository<T> extends OnModuleInit {
  create(index: string, mapping: Mapping): Promise<void>;

  index(id: string, document: Partial<T>): Promise<void>;

  search(query: Query): Promise<T[]>;

  delete(id: string): Promise<void>;
}
