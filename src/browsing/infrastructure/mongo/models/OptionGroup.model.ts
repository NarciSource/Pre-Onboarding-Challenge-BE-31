import { Prop, Schema } from "@nestjs/mongoose";
import { OptionModel } from "./Option.model";

@Schema({ _id: false })
export default class OptionGroupModel {
  @Prop({ unique: true })
  id: number;

  @Prop()
  name: string;

  @Prop()
  display_order: number;

  @Prop({ type: [OptionModel] })
  options: OptionModel[];
}
