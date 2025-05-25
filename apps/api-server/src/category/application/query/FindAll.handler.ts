import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IBaseRepository } from "@libs/domain/repository";

import { Category } from "category/domain/entities";
import { CategoryEntity } from "category/infrastructure/rdb/entities";
import FindAllQuery from "./FindAll.query";

@QueryHandler(FindAllQuery)
export default class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject("ICategoryRepository")
    private readonly repository: IBaseRepository<CategoryEntity>,
  ) {}

  async execute({ level = 1 }: FindAllQuery) {
    type NestedCategory = Omit<Category, "parent"> & { children?: NestedCategory[] };

    function build_tree(
      categories: Category[],
      level: number, // 1: 대분류, 2: 중분류, 3: 소분류
      parent_id?: number,
    ): NestedCategory[] {
      if (level > 3) {
        return [];
      }

      const result = categories
        .filter((category) => category.parent?.id === parent_id)
        .map(({ id, parent: _parent, ...rest }) => {
          const children = build_tree(categories, level + 1, id);

          return {
            id,
            ...rest,
            ...(children.length > 0 && { children }),
          };
        });
      return result;
    }

    // 카테고리 정보 조회
    const categories = await this.repository.find({
      relations: ["parent"],
    });

    // 카테고리 트리 구조로 변환
    return build_tree(categories, level);
  }
}
