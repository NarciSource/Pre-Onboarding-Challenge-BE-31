import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { Product_Summary } from "@libs/domain/entities";
import { IQueryRepository, ISearchRepository, Query } from "@libs/domain/repository";
import { ProductSummaryDocument } from "@libs/infrastructure/es/mapping";
import { ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import FindAllQuery from "./FindAll.query";

@QueryHandler(FindAllQuery)
export default class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject("IProductSummaryQueryRepository")
    private readonly query_repository: IQueryRepository<ProductSummaryModel>,
    @Inject("IProductSummarySearchRepository")
    private readonly search_repository: ISearchRepository<ProductSummaryDocument>,
  ) {}

  async execute({
    dto: {
      page = 1,
      per_page = 10,
      sort,
      status,
      max_price,
      min_price,
      category: category_ids,
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
    let items: Product_Summary[];

    if (!search) {
      const where = {
        ...(status ? { status } : {}),
        base_price: {
          $gte: min_price ?? 0,
          $lte: max_price ?? Number.MAX_SAFE_INTEGER,
        },
        ...(category_ids?.length ? { "categories.id": { $in: category_ids } } : {}),
        ...(seller_id ? { seller_id } : {}),
        ...(brand_id ? { brand_id } : {}),
        ...(in_stock ? { in_stock } : {}),
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
            ...(category_ids?.length ? [{ terms: { "categories.id": category_ids } }] : []),
            ...(seller_id ? [{ match: { seller_id } }] : []),
            ...(brand_id ? [{ match: { brand_id } }] : []),
            ...(in_stock ? [{ match: { in_stock } }] : []),
            {
              multi_match: {
                query: search ?? "",
                fields: [
                  "name",
                  "short_description",
                  "brand.name",
                  "seller.name",
                  "primary_image.alt_text",
                ],
                operator: "and",
                fuzziness: "auto",
              },
            },
          ],
        },
      } as Query;

      const results = await this.search_repository.search(query);
      items = results.map(({ created_at, ...remains }) => ({
        created_at: new Date(created_at),
        ...remains,
      }));
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
