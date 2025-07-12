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
      provide: "IProductSummarySearchRepository",
      useFactory: (es: ElasticsearchService) => new SearchRepository(es, "product_summary"),
      inject: [ElasticsearchService],
    },
    {
      provide: "IProductCatalogSearchRepository",
      useFactory: (es: ElasticsearchService) => new SearchRepository(es, "product_catalog"),
      inject: [ElasticsearchService],
    },
    {
      provide: "IFeaturedCategorySearchRepository",
      useFactory: (es: ElasticsearchService) => new SearchRepository(es, "featured_category"),
      inject: [ElasticsearchService],
    },
    {
      provide: "INestedCategorySearchRepository",
      useFactory: (es: ElasticsearchService) => new SearchRepository(es, "nested_category"),
      inject: [ElasticsearchService],
    },
  ],
  exports: [
    "IProductSummarySearchRepository",
    "IProductCatalogSearchRepository",
    "IFeaturedCategorySearchRepository",
    "INestedCategorySearchRepository",
  ],
})
export default class ESearchModule {}
