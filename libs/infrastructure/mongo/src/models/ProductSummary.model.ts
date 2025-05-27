import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export class Image {
  @Prop() url: string;
  @Prop({ type: String }) alt_text: string | null;
}

export class Seller {
  @Prop() id: number;
  @Prop() name: string;
}

export class Brand {
  @Prop() id: number;
  @Prop() name: string;
}

@Schema()
export default class ProductSummaryModel {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: String })
  short_description: string | null;

  @Prop()
  base_price: number;

  @Prop({ type: String })
  sale_price: number | null;

  @Prop()
  currency: string;

  @Prop({ type: Image })
  primary_image: {
    url: string;
    alt_text: string | null;
  } | null;

  @Prop({ type: Brand })
  brand: {
    id: number;
    name: string;
  };

  @Prop({ type: Seller })
  seller: {
    id: number;
    name: string;
  };

  @Prop()
  status: string;

  @Prop({ index: true })
  created_at: Date;

  @Prop()
  stock: number;

  @Prop({ index: true })
  rating: number;

  @Prop()
  review_count: number;

  @Prop({ select: false })
  categories: number[];
}

export const ProductSummarySchema = SchemaFactory.createForClass(ProductSummaryModel);

ProductSummarySchema.virtual("in_stock").get(function () {
  return this.stock > 0;
});
ProductSummarySchema.plugin(mongooseLeanVirtuals);

ProductSummarySchema.index({ status: 1, base_price: 1, created_at: -1 })
  .index({ seller_id: 1, base_price: 1, created_at: -1 })
  .index({ brand_id: 1, base_price: 1, created_at: -1 })
  .index({ categories: 1, created_at: -1 });
