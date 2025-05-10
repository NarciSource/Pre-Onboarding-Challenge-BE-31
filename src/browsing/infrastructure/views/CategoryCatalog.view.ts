import { ViewColumn, ViewEntity } from "typeorm";

import { ProductCategoryEntity, ProductEntity } from "@product/infrastructure/entities";
import { CategoryEntity } from "@category/infrastructure/entities";

@ViewEntity({
  expression: (dataSource) => {
    return dataSource
      .getRepository(CategoryEntity)
      .createQueryBuilder("categories")
      .innerJoinAndSelect(
        ProductCategoryEntity,
        "product_categories",
        "product_categories.category_id = categories.id",
      )
      .innerJoinAndSelect(ProductEntity, "products", "products.id = product_categories.product_id")
      .select([
        "categories.id as id",
        "categories.name as name",
        "categories.slug as slug",
        "categories.image_url as image_url",
      ])
      .addSelect("COUNT(products.id)", "product_count")
      .groupBy("categories.id")
      .orderBy("product_count", "DESC")
      .limit(5);
  },
})
export default class CategoryCatalogView {
  @ViewColumn() id: number;

  @ViewColumn() name: string;

  @ViewColumn() slug: string;

  @ViewColumn() image_url: string;

  @ViewColumn() product_count: number;
}
