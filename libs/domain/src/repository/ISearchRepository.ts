import { Client } from "@elastic/elasticsearch";

export type Query = NonNullable<Parameters<Client["search"]>[0]>["query"];

export default interface ISearchRepository {
  index<T>(id: string, document: T): Promise<void>;

  search<T>(query: Query): Promise<T[]>;

  delete(id: string): Promise<void>;
}
