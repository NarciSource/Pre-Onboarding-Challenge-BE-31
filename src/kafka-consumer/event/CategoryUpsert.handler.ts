import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";

import { CategoryModel } from "@kafka-consumer/model";
import { IQueryRepository } from "@shared/repositories";
import { CategoryEntity } from "@category/infrastructure/rdb/entities";
import CategoryUpsertEvent from "./CategoryUpsert.event";

@EventsHandler(CategoryUpsertEvent)
export default class CategoryUpsertHandler {
  constructor(
    @Inject("ICategoryStateRepository")
    private readonly category_state_repository: IQueryRepository<CategoryModel>,
  ) {}

  async handle({ after }: CategoryUpsertEvent) {
    const category = after as CategoryEntity;

    await this.category_state_repository.updateOne({ id: category.id }, category, { upsert: true });
  }
}
