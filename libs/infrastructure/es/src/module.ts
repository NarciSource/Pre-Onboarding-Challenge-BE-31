import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ElasticsearchModule, ElasticsearchService } from "@nestjs/elasticsearch";

import { elastic_search_config } from "@libs/config";

import { SearchRepository } from "./repositories/Search.repository";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env"] }),
    ElasticsearchModule.registerAsync(elastic_search_config),
  ],
  providers: [
    {
      provide: "ISummarySearchRepository",
      useFactory: (es: ElasticsearchService) => new SearchRepository(es, "summary"),
      inject: [ElasticsearchService],
    },
  ],
  exports: ["ISummarySearchRepository"],
})
export default class ESearchModule {}
