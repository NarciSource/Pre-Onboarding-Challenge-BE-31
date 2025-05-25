import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IBaseRepository, IQueryRepository } from "@shared/repositories";
import { CategoryEntity } from "@category/infrastructure/rdb/entities";
import { ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import FindProductsQuery from "./FindProducts.query";

@QueryHandler(FindProductsQuery)
export default class FindProductsHandler implements IQueryHandler<FindProductsQuery> {
  constructor(
    @Inject("ICategoryRepository")
    private readonly repository: IBaseRepository<CategoryEntity>,
    @Inject("IProductSummaryQueryRepository")
    private readonly summary_repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async execute({
    category_id,
    dto: { page = 1, per_page = 10, sort = "created_at:desc", has_sub = true },
  }: FindProductsQuery) {
    const [sort_field, sort_order] = (sort?.split(":") ?? ["created_at", "DESC"]) as [
      string,
      "ASC" | "DESC",
    ];

    // 카테고리 정보 조회
    const category = await this.repository.findOne({
      where: { id: category_id },
      relations: ["parent"],
    });

    if (!category) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Category", resourceId: category_id },
      });
    }
    if (!has_sub) {
      category.parent = null;
    }

    // 아이템 필터링
    const items = await this.summary_repository.find({
      where: { categories: { $in: [category_id] } },
      order: { [sort_field]: sort_order },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    // 페이지네이션 요약 정보
    const pagination = {
      total_items: items.length,
      total_pages: Math.ceil(items.length / per_page),
      current_page: page,
      per_page: per_page,
    };

    return {
      category,
      items,
      pagination,
    };
  }
}
