import { Prop, Schema } from "@nestjs/mongoose";

import { Product_Option } from "@libs/domain/entities";

@Schema()
export class OptionModel implements Omit<Product_Option, "option_group" | "option_group_id"> {
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
