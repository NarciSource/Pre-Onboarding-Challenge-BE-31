// eslint-disable-next-line import/no-unresolved
import { QueryDslQueryContainer, MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";
import { OnModuleInit } from "@nestjs/common";

export type Query = QueryDslQueryContainer;
export type Mapping = MappingTypeMapping;

export default interface ISearchRepository<T> extends OnModuleInit {
  create(index: string, mapping: Mapping): Promise<void>;

  index(id: string, document: Partial<T>): Promise<void>;

  search(query: Query): Promise<T[]>;

  delete(id: string): Promise<void>;
}
