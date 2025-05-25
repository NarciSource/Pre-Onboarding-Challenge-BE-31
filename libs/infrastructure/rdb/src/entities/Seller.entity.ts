import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

import { Seller } from "@libs/domain/entities";

@Entity("sellers")
export default class SellerEntity implements Seller {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  logo_url: string | null;

  @Column({ type: "decimal", precision: 3, scale: 2, nullable: true })
  rating: number | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  contact_email: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  contact_phone: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
