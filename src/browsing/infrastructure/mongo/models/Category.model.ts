import { Prop } from "@nestjs/mongoose";

export class ParentCategory {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}

export default class CategoryModel {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  is_primary: boolean;

  @Prop({ type: ParentCategory })
  parent: ParentCategory | null;
}
