import { Prop, Schema } from "@nestjs/mongoose";
import CategoryModel from "./sub/Category.model";

class ExtendedCategoryModel extends CategoryModel {
  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  image_url: string | null;
}

@Schema({ collection: "nested_category" })
export default class NestedCategoryModel extends ExtendedCategoryModel {
  @Prop({ type: String })
  children: NestedCategoryModel | null;
}
