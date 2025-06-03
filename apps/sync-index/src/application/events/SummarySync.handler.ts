import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { ISearchRepository } from "@libs/domain/repository";

import SummarySyncEvent from "./SummarySync.event";

@EventsHandler(SummarySyncEvent)
export default class SummarySyncHandler {
  constructor(
    @Inject("ISummarySearchRepository")
    private readonly repository: ISearchRepository,
  ) {}

  async handle({ docs }: SummarySyncEvent) {
    const { id, _id, __v, ...body } = docs;

    await this.repository.index(String(id), body);
  }
}
