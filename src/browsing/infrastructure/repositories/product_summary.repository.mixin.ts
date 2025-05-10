import { ProductSummaryDTO } from "@product/application/dto";
import { ProductCategoryEntity } from "@product/infrastructure/entities";
import { CategoryEntity } from "@category/infrastructure/entities";
import { ProductSummaryView } from "../views";

const product_summary_repository_mixin = {
  async find_by_filters({
    page,
    per_page,
    sort_field,
    sort_order,
    status,
    category: categories,
    min_price,
    max_price,
    seller,
    brand,
    search,
  }: {
    page?: number;
    per_page?: number;
    sort_field: string;
    sort_order: string;
    status?: string;
    min_price?: number;
    max_price?: number;
    category?: number[];
    seller?: number;
    brand?: number;
    search?: string;
  }): Promise<ProductSummaryDTO[]> {
    // 카테고리 조인
    const inner_query = this.manager
      .createQueryBuilder()
      .subQuery()
      .select("product_category.product_id")
      .from(ProductCategoryEntity, "product_category")
      .leftJoin(CategoryEntity, "category", "category.id = product_category.category_id")
      .where("category.id IN (:...categories)")
      .getQuery();

    // 상품 집계 처리 쿼리
    const query = this.manager
      .getRepository(ProductSummaryView)
      .createQueryBuilder("summary")
      .where(status ? "summary.status = :status" : "1=1", { status })
      .andWhere(min_price ? "summary.base_price >= :minPrice" : "1=1", { minPrice: min_price })
      .andWhere(max_price ? "summary.base_price <= :maxPrice" : "1=1", { maxPrice: max_price })
      .andWhere(categories ? `summary.id IN ${inner_query}` : "1=1")
      .andWhere(seller ? "summary.seller->>'id' = :seller" : "1=1", { seller })
      .andWhere(brand ? "summary.brand->>'id' = :brand" : "1=1", { brand })
      .andWhere(search ? "summary.name LIKE :search" : "1=1", { search: `%${search}%` })
      .orderBy(`summary.${sort_field}`, sort_order.toUpperCase() as "ASC" | "DESC")
      .setParameter("categories", categories);

    if (page && per_page) {
      query.offset((page - 1) * per_page).limit(per_page);
    }

    // 쿼리 실행
    return await query.getMany();
  },
};

export default product_summary_repository_mixin;
