import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { Product, Product_Tag, Tag } from "@libs/domain/entities";

import ProductEntity from "./Product.entity";
import TagEntity from "./Tag.entity";

@Entity("product_tags")
export default class ProductTagEntity implements Product_Tag {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product: Product;
  product_id: number;

  @ManyToOne(() => TagEntity, (tag) => tag.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tag_id" })
  tag: Tag;
  tag_id: number;
}
