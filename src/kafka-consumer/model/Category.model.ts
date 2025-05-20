import { Prop, Schema } from "@nestjs/mongoose";

export class ParentCategory {
  @Prop()
  id: number;

  @Prop()
  name?: string;

  @Prop()
  slug?: string;
}

@Schema()
export default class CategoryModel {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name?: string;

  @Prop()
  slug?: string;

  @Prop()
  is_primary: boolean;

  @Prop({ type: Number })
  parent_id?: number | null;
  parent?: ParentCategory | null;
}
