import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Product_Option, Product_Option_Group } from "@libs/domain/entities";

import ProductOptionGroupEntity from "./Product_Option_Group.entity";

@Entity("product_options")
export default class ProductOptionEntity implements Product_Option {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductOptionGroupEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "option_group_id" })
  option_group: Product_Option_Group;
  option_group_id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  additional_price: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  sku: string | null;

  @Column({ type: "int", default: 0 })
  stock: number;

  @Column({ type: "int", default: 0 })
  display_order: number;
}
