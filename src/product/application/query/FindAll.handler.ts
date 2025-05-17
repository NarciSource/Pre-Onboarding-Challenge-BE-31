import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "@shared/repositories";
import { ProductSummaryModel } from "@browsing/infrastructure/mongo/models";
import FindAllQuery from "./FindAll.query";

@QueryHandler(FindAllQuery)
export default class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject("IProductSummaryQueryRepository")
    private readonly repository: IQueryRepository<ProductSummaryModel>,
  ) {}

  async execute({
    dto: {
      page = 1,
      per_page = 10,
      sort,
      status,
      max_price,
      min_price,
      category: categories,
      seller: seller_id,
      brand: brand_id,
      in_stock,
      search,
    },
  }: FindAllQuery) {
    const [sort_field, sort_order] = (sort?.split(":") ?? ["created_at", "DESC"]) as [
      string,
      "ASC" | "DESC",
    ];

    const items = await this.repository.find({
      where: {
        ...(status ? { status } : {}),
        base_price: {
          $gte: min_price ?? 0,
          $lte: max_price ?? Number.MAX_SAFE_INTEGER,
        },
        ...(categories?.length ? { categories: { $in: categories } } : {}),
        ...(seller_id ? { seller: { id: seller_id } } : {}),
        ...(brand_id ? { brand: { id: brand_id } } : {}),
        in_stock,
        name: { $regex: search ?? "", $options: "i" },
      },
      order: { [sort_field]: sort_order },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    // 페이지네이션 요약 정보
    const pagination = {
      total_items: items.length,
      total_pages: Math.ceil(items.length / (per_page ?? 10)),
      current_page: page ?? 1,
      per_page: per_page ?? 10,
    };

    return { items, pagination };
  }
}
