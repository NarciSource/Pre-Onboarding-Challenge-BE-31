import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

import { Tag } from "@libs/domain/entities";

@Entity("tags")
@Unique(["slug"])
export default class TagEntity implements Tag {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;
}
