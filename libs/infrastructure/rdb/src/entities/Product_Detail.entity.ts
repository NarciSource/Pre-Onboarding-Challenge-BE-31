import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

import { Product, Product_Detail } from "@libs/domain/entities";

import ProductEntity from "./Product.entity";

@Entity("product_details")
export default class ProductDetailEntity implements Product_Detail {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @OneToOne(() => ProductEntity, (product) => product.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
  product_id: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  weight: number | null;

  @Column("jsonb", { nullable: true })
  dimensions: {
    width: number;
    height: number;
    depth: number;
  } | null;

  @Column("text", { nullable: true })
  materials: string | null;

  @Column("varchar", { length: 100, nullable: true })
  country_of_origin: string | null;

  @Column("text", { nullable: true })
  warranty_info: string | null;

  @Column("text", { nullable: true })
  care_instructions: string | null;

  @Column("jsonb", { nullable: true })
  additional_info: {
    assembly_required: boolean;
    assembly_time: string;
  } | null;
}
