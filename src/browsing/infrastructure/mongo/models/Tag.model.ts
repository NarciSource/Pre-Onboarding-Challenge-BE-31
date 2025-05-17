import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export default class TagModel {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}
