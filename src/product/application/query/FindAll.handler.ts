import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Between, In, Like } from "typeorm";

import { IBrowsingRepository } from "@shared/repositories";
import { ProductSummaryView } from "@browsing/infrastructure/rdb/views";
import FindAllQuery from "./FindAll.query";

@QueryHandler(FindAllQuery)
export default class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject("IProductSummaryRepository")
    private readonly product_summary_repository: IBrowsingRepository<ProductSummaryView>,
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
    const [sort_field, sort_order] = sort?.split(":") ?? ["created_at", "DESC"];

    const items = await this.product_summary_repository.find({
      where: {
        status,
        base_price: Between(min_price ?? 0, max_price ?? Number.MAX_SAFE_INTEGER),
        categories: In(categories ?? []),
        ...(seller_id ? { seller: { id: seller_id } } : {}),
        ...(brand_id ? { brand: { id: brand_id } } : {}),
        in_stock,
        name: Like(`%${search ?? ""}%`),
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
