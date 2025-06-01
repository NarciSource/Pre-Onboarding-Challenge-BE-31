import { EventsHandler } from "@nestjs/cqrs";

import SummarySyncEvent from "./SummarySync.event";

@EventsHandler(SummarySyncEvent)
export default class SummarySyncHandler {
  constructor() {}

  async handle({ before, after }: SummarySyncEvent) {}
}
