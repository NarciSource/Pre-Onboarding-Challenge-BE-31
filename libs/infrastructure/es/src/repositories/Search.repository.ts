import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";

import { ISearchRepository, Mapping, Query } from "@libs/domain/repository";

@Injectable()
export class SearchRepository<T> implements ISearchRepository<T> {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly index_name: string,
    private readonly mapping: Mapping,
  ) {}

  async onModuleInit() {
    await this.create(this.index_name, this.mapping);
  }

  async create(index_name: string, mapping: Mapping) {
    const exists = await this.es.indices.exists({ index: index_name });

    if (!exists) {
      await this.es.indices.create({
        index: index_name,
        settings: {
          analysis: {
            analyzer: {
              korean: {
                type: "custom",
                tokenizer: "nori_tokenizer",
                filter: ["lowercase", "nori_readingform", "korean_stop"],
                char_filter: ["html_strip"],
              },
            },
            tokenizer: {
              nori_tokenizer: {
                type: "nori_tokenizer",
                decompound_mode: "mixed",
              },
            },
            filter: {
              korean_stop: {
                type: "stop",
                stopwords: ["의", "가", "은", "는"],
              },
            },
          },
        },
        mappings: mapping,
      });
    }
  }

  async index(id: string, document: T): Promise<void> {
    await this.es.index({
      index: this.index_name,
      id,
      document,
    });
  }

  async search(query: Query): Promise<T[]> {
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
