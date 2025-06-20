import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Brand, Product, Seller } from "@libs/domain/entities";

import BrandEntity from "./Brand.entity";
import SellerEntity from "./Seller.entity";

@Entity("products")
export default class ProductEntity implements Product {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  short_description: string | null;

  @Column({ type: "text", nullable: true })
  full_description: string | null;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @ManyToOne(() => SellerEntity)
  @JoinColumn({ name: "seller_id" })
  seller: Seller;
  seller_id: number;

  @ManyToOne(() => BrandEntity)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;
  brand_id: number;

  @Column({ type: "varchar", length: 20 })
  status: string;
}
