import { Prop, Schema } from "@nestjs/mongoose";

import { Product_Option_Group } from "@libs/domain/entities";
import { OptionModel } from "./Option.model";

@Schema()
export default class OptionGroupModel
  implements Omit<Product_Option_Group, "product" | "product_id">
{
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  display_order: number;

  @Prop({ type: [OptionModel] })
  options: OptionModel[];
}
