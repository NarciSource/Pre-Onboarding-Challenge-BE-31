import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";

import { ISearchRepository, Query } from "@libs/domain/repository";

@Injectable()
export class SearchRepository implements ISearchRepository {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly index_name: string,
  ) {}

  async index<T>(id: string, document: T): Promise<void> {
    await this.es.index({
      index: this.index_name,
      id,
      document,
    });
  }

  async search<T>(query: Query): Promise<T[]> {
    const result = await this.es.search({
      index: this.index_name,
      query,
    });

    return result.hits.hits.map((hit) => hit._source as T);
  }

  async delete(id: string): Promise<void> {
    await this.es.delete({
      index: this.index_name,
      id,
    });
  }
}
