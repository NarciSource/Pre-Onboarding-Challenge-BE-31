import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("tags")
@Unique(["slug"])
export default class TagEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug: string;
}
