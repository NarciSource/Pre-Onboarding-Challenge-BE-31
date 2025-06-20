import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Product, Product_Image, Product_Option } from "@libs/domain/entities";

import ProductEntity from "./Product.entity";
import ProductOptionEntity from "./Product_Option.entity";

@Entity("product_images")
export default class ProductImageEntity implements Product_Image {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
  product_id: number;

  @Column({ type: "varchar", length: 255 })
  url: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  alt_text: string | null;

  @Column({ type: "boolean", default: false })
  is_primary: boolean;

  @Column({ type: "int", default: 0 })
  display_order: number;

  @ManyToOne(() => ProductOptionEntity, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "option_id" })
  option: Product_Option | null;
  option_id: number | null;
}
