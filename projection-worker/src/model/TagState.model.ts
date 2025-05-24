import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class TagStateModel {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name?: string;

  @Prop()
  slug?: string;
}
