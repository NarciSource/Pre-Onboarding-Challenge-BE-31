import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@query/domain/repositories";
import { CategoryEntity } from "@query/rdb/entities";

import { CategoryStateModel } from "../model";
import CategoryUpsertEvent from "./CategoryUpsert.event";

@EventsHandler(CategoryUpsertEvent)
export default class CategoryUpsertHandler {
  constructor(
    @Inject("ICategoryStateRepository")
    private readonly category_state_repository: IQueryRepository<CategoryStateModel>,
  ) {}

  async handle({ after }: CategoryUpsertEvent) {
    const category = after as CategoryEntity;

    await this.category_state_repository.updateOne({ id: category.id }, category, { upsert: true });
  }
}
