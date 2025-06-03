import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IQueryRepository, ISearchRepository, Query } from "@libs/domain/repository";
import { ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import FindAllQuery from "./FindAll.query";

@QueryHandler(FindAllQuery)
export default class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject("IProductSummaryQueryRepository")
    private readonly query_repository: IQueryRepository<ProductSummaryModel>,
    @Inject("ISummarySearchRepository")
    private readonly search_repository: ISearchRepository,
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
    let items: ProductSummaryModel[];

    if (!search) {
      const where = {
        ...(status ? { status } : {}),
        base_price: {
          $gte: min_price ?? 0,
          $lte: max_price ?? Number.MAX_SAFE_INTEGER,
        },
        ...(categories?.length ? { categories: { $in: categories } } : {}),
        ...(seller_id ? { seller_id } : {}),
        ...(brand_id ? { brand_id } : {}),
        ...(in_stock ? { stock: { $gt: 0 } } : { stock: { $lte: 0 } }),
        name: { $regex: search ?? "", $options: "i" },
      };

      items = await this.query_repository.find({
        where,
        order: { [sort_field]: sort_order },
        skip: (page - 1) * per_page,
        take: per_page,
      });
    } else {
      const query = {
        bool: {
          must: [
            ...(status ? [{ match: { status } }] : []),
            {
              range: {
                base_price: {
                  gte: min_price ?? 0,
                  lte: max_price ?? Number.MAX_SAFE_INTEGER,
                },
              },
            },
            ...(categories?.length ? [{ terms: { categories } }] : []),
            ...(seller_id ? [{ match: { seller_id } }] : []),
            ...(brand_id ? [{ match: { brand_id } }] : []),
            {
              range: {
                stock: {
                  [in_stock ? "gt" : "lte"]: 0,
                },
              },
            },
            {
              multi_match: {
                query: search ?? "",
                fields: ["name", "short_description"],
                operator: "and",
                fuzziness: "auto",
              },
            },
          ],
        },
      } as Query;

      items = await this.search_repository.search(query);
    }

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
