import { Prop } from "@nestjs/mongoose";

export default class CategoryModel {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}
