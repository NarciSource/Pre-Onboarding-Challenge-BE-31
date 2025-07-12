import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@libs/domain/repository";
import { NestedCategoryModel } from "@libs/infrastructure/mongo/models";

import FindAllQuery from "./FindAll.query";

@QueryHandler(FindAllQuery)
export default class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject("INestedCategoryQueryRepository")
    private readonly repository: IQueryRepository<NestedCategoryModel>,
  ) {}

  async execute({ level = 1 }: FindAllQuery) {
    // 카테고리 정보 조회
    const categories = await this.repository.find({
      where: { level },
    });

    return categories;
  }
}
