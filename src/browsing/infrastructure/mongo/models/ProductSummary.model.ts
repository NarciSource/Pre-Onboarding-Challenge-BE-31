import { Prop, Schema } from "@nestjs/mongoose";

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

  @Prop()
  created_at: Date;

  @Prop()
  in_stock: boolean;

  @Prop()
  rating: number;

  @Prop()
  review_count: number;
}
