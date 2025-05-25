import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "query/domain/repositories";
import { TagEntity } from "query/rdb/entities";

import { TagStateModel } from "../../infrastructure/model";
import TagUpsertEvent from "./TagUpsert.event";

@EventsHandler(TagUpsertEvent)
export default class TagUpsertHandler {
  constructor(
    @Inject("ITagStateRepository")
    private readonly tag_state_repository: IQueryRepository<TagStateModel>,
  ) {}

  async handle({ after }: TagUpsertEvent) {
    const tag = after as TagEntity;

    await this.tag_state_repository.updateOne({ id: tag.id }, tag, { upsert: true });
  }
}
