import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

import { Brand } from "@libs/domain/entities";

@Entity("brands")
@Unique(["slug"])
export default class BrandEntity implements Brand {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  logo_url: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  website: string | null;
}
