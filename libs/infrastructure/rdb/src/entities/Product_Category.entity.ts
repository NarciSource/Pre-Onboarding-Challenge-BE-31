import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Category, Product, Product_Category } from "@libs/domain/entities";

import CategoryEntity from "./Category.entity";
import ProductEntity from "./Product.entity";

@Entity("product_categories")
export default class ProductCategoryEntity implements Product_Category {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
  product_id: number;

  @ManyToOne(() => CategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: Category;
  category_id: number;

  @Column({ type: "boolean", default: false })
  is_primary: boolean;
}
