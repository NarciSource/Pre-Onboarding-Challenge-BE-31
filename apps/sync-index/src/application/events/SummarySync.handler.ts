import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { ISearchRepository } from "@libs/domain/repository";
import { ProductSummaryDocument } from "@libs/infrastructure/es/mapping";

import SummarySyncEvent from "./SummarySync.event";

@EventsHandler(SummarySyncEvent)
export default class SummarySyncHandler {
  constructor(
    @Inject("ISummarySearchRepository")
    private readonly repository: ISearchRepository<ProductSummaryDocument>,
  ) {}

  async handle({ docs }: SummarySyncEvent) {
    const { id, _id, __v, created_at, ...remains } = docs;
    const body = { created_at: created_at / 1000, ...remains };

    await this.repository.index(String(id), body);
  }
}
