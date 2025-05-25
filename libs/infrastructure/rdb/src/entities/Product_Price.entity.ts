import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

import { Product, Product_Price } from "@libs/domain/entities";

import ProductEntity from "./Product.entity";

@Entity("product_prices")
export default class ProductPriceEntity implements Product_Price {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @OneToOne(() => ProductEntity, (product) => product.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
  product_id: number;

  @Column("decimal", { precision: 12, scale: 2, nullable: false })
  base_price: number;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  sale_price: number | null;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  cost_price: number | null;

  @Column("varchar", { length: 3, default: "KRW" })
  currency: string;

  @Column("decimal", { precision: 5, scale: 2, nullable: true })
  tax_rate: number | null;
}
