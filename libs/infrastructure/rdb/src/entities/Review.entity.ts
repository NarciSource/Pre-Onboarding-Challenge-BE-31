import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

import { Review } from "@libs/domain/entities";

import ProductEntity from "./Product.entity";
import UserEntity from "./User.entity";

@Entity("reviews")
export default class ReviewEntity implements Review {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
  product_id: number;

  @ManyToOne(() => UserEntity, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "user_id" })
  user: UserEntity | null;

  @Column({ type: "int", nullable: false })
  rating: 1 | 2 | 3 | 4 | 5;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string | null;

  @Column({ type: "text", nullable: true })
  content: string | null;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @Column({ type: "boolean", default: false })
  verified_purchase: boolean;

  @Column({ type: "int", default: 0 })
  helpful_votes: number;
}
