import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

import { User } from "@libs/domain/entities";

@Entity("users")
export default class UserEntity implements User {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar_url: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
