import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class ParentCategory {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}

@Schema({ _id: false })
export default class CategoryModel {
  @Prop({ unique: true })
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
