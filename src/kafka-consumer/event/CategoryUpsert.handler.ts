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
    const { id, parent_id, ...category } = after as CategoryEntity;

    const parent = await this.category_state_repository.findOneBy({ id: parent_id });

    await this.category_state_repository.update(id, { id, ...category, parent });
  }
}
