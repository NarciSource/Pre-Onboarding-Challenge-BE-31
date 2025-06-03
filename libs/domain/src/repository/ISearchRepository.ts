import { Client } from "@elastic/elasticsearch";
import { OnModuleInit } from "@nestjs/common";

export type Query = NonNullable<Parameters<Client["search"]>[0]>["query"];
export type Mapping = Parameters<Client["indices"]["create"]>[0]["mappings"];

export default interface ISearchRepository extends OnModuleInit {
  create(index: string, mapping: Mapping): Promise<void>;

  index<T>(id: string, document: T): Promise<void>;

  search<T>(query: Query): Promise<T[]>;

  delete(id: string): Promise<void>;
}
