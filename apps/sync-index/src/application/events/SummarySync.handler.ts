import { EventsHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";

import SummarySyncEvent from "./SummarySync.event";

@EventsHandler(SummarySyncEvent)
export default class SummarySyncHandler {
  constructor(private readonly service: ElasticsearchService) {}

  async handle({ collection, docs }: SummarySyncEvent) {
    const { id, _id, __v, ...body } = docs;

    await this.service.index({
      index: collection,
      id: String(id),
      body,
    });
  }
}
