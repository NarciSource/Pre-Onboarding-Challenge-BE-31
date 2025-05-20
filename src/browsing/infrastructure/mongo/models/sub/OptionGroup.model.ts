import { Prop } from "@nestjs/mongoose";
import { OptionModel } from "./Option.model";

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
