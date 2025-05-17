import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export default class PriceModel {
  @Prop()
  base_price: number;

  @Prop({ type: Number })
  sale_price: number | null;

  @Prop()
  currency: string;

  @Prop({ type: Number })
  tax_rate: number | null;

  @Prop({ type: Number })
  discount_percentage: number | null;
}
