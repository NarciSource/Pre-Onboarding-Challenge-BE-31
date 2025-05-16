import { EntityManager, FindOperator, FindOptionsOrder, FindOptionsWhere } from "typeorm";

import { ProductCategoryEntity } from "@product/infrastructure/rdb/entities";
import { CategoryEntity } from "@category/infrastructure/rdb/entities";
import { ProductSummaryDTO } from "@browsing/presentation/dto";
import { ProductSummaryView } from "../views";

const product_summary_repository_mixin = {
  async find(
    this: {
      manager: EntityManager;
    },
    options?: {
      where?: FindOptionsWhere<ProductSummaryView> & {
        categories?: FindOperator<number[]>;
      };
      order?: FindOptionsOrder<ProductSummaryView>;
      skip?: number;
      take?: number;
    },
  ): Promise<ProductSummaryDTO[]> {
    const query = this.manager
      .getRepository(ProductSummaryView)
      .createQueryBuilder("summary")
      .where("1=1");

    // 조건
    const where = options?.where ?? {};

    if (where.status) {
      query.andWhere("summary.status = :status", { status: where.status });
    }

    if (where.base_price) {
      if (where.base_price instanceof FindOperator) {
        const [min_price, max_price] = where.base_price.value as unknown as [number, number];

        query.andWhere("summary.base_price BETWEEN :min_price AND :max_price", {
          min_price,
          max_price,
        });
      } else {
        query.andWhere("summary.base_price = :base_price", {
          base_price: where.base_price,
        });
      }
    }

    if (
      where.categories &&
      where.categories instanceof FindOperator &&
      where.categories.value.length > 0
    ) {
      const values = where.categories.value as unknown as number[];

      // 카테고리 조인
      const inner_query = this.manager
        .createQueryBuilder()
        .subQuery()
        .select("product_category.product_id")
        .from(ProductCategoryEntity, "product_category")
        .leftJoin(CategoryEntity, "category", "category.id = product_category.category_id")
        .where("category.id IN (:...category_ids)")
        .getQuery();

      query.andWhere(`summary.id IN ${inner_query}`).setParameter("category_ids", values);
    }

    if (where.seller && typeof where.seller === "object" && "id" in where.seller) {
      query.andWhere("summary.seller->>'id' = :seller_id", {
        seller_id: where.seller.id,
      });
    }

    if (where.brand && typeof where.brand === "object" && "id" in where.brand) {
      query.andWhere("summary.brand->>'id' = :brand_id", {
        brand_id: where.brand.id,
      });
    }

    if (where.in_stock) {
      query.andWhere("summary.in_stock = :in_stock", { in_stock: where.in_stock });
    }

    if (where.name instanceof FindOperator && where.name.type === "like") {
      query.andWhere("summary.name LIKE :name", { name: where.name.value });
    }

    // 정렬
    if (options?.order) {
      for (const [field, direction] of Object.entries(options.order)) {
        if (typeof direction === "string") {
          query.addOrderBy(`summary.${field}`, direction.toUpperCase() as "ASC" | "DESC");
        }
      }
    }

    // 페이징
    query.skip(options?.skip ?? 0);
    query.take(options?.take ?? 10);

    // 쿼리 실행
    return await query.getMany();
  },
};

export default product_summary_repository_mixin;
