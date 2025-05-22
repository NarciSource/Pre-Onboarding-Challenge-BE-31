import { Prop, Schema } from "@nestjs/mongoose";
import { OptionModel } from "./Option.model";

@Schema()
export default class OptionGroupModel {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  display_order: number;

  @Prop({ type: [OptionModel] })
  options: OptionModel[];
}
