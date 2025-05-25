import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { Category } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";

import { CategoryStateModel } from "../../infrastructure/model";
import CategoryUpsertEvent from "./CategoryUpsert.event";

@EventsHandler(CategoryUpsertEvent)
export default class CategoryUpsertHandler {
  constructor(
    @Inject("ICategoryStateRepository")
    private readonly category_state_repository: IQueryRepository<CategoryStateModel>,
  ) {}

  async handle({ after }: CategoryUpsertEvent) {
    const category = after as Category;

    await this.category_state_repository.updateOne({ id: category.id }, category, { upsert: true });
  }
}
