import { Prop } from "@nestjs/mongoose";

export default class TagModel {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}
