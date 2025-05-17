import { Prop } from "@nestjs/mongoose";

export class OptionModel {
  @Prop()
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
