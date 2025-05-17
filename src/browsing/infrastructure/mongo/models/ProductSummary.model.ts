import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export default class ProductSummaryModel extends Document {
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

  @Prop({
    type: {
      url: { type: String },
      alt_text: { type: String },
    },
  })
  primary_image: {
    url: string;
    alt_text: string | null;
  };

  @Prop({
    type: {
      id: { type: Number },
      name: { type: String },
    },
  })
  brand: {
    id: number;
    name: string;
  };

  @Prop({
    type: {
      id: { type: Number },
      name: { type: String },
    },
  })
  seller: {
    id: number;
    name: string;
  };

  @Prop()
  status: string;

  @Prop()
  created_at: Date;

  @Prop()
  in_stock: boolean;

  @Prop()
  rating: number;

  @Prop()
  review_count: number;
}
