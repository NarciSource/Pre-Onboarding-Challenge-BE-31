import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class OptionModel {
  @Prop({ unique: true })
  id: number;

  @Prop()
  name: string;

  @Prop()
  additional_price: number;

  @Prop({ type: String })
  sku: string | null;

  @Prop()
  stock: number;

  @Prop()
  display_order: number;
}
