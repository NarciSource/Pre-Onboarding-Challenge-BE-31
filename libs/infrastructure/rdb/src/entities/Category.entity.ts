import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Category } from "@libs/domain/entities";

@Entity("categories")
export default class CategoryEntity implements Category {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @ManyToOne(() => CategoryEntity, (category) => category.id, { nullable: true })
  @JoinColumn({ name: "parent_id" })
  parent: CategoryEntity | null;
  parent_id: number | null;

  @Column({ type: "integer", nullable: false })
  level: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  image_url: string | null;
}
