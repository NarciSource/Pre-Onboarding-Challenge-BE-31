import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Product, Product_Option_Group } from "@libs/domain/entities";

import ProductEntity from "./Product.entity";

@Entity("product_option_groups")
export default class ProductOptionGroupEntity implements Product_Option_Group {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
  product_id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "int", default: 0 })
  display_order: number;
}
