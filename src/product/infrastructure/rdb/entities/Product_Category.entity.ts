import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { CategoryEntity } from "@category/infrastructure/rdb/entities";
import ProductEntity from "./Product.entity";

@Entity("product_categories")
export default class ProductCategoryEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
  product_id: number;

  @ManyToOne(() => CategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;
  category_id: number;

  @Column({ type: "boolean", default: false })
  is_primary: boolean;
}
