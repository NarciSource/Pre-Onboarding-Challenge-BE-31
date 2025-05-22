import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class TagModel {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name?: string;

  @Prop()
  slug?: string;
}
