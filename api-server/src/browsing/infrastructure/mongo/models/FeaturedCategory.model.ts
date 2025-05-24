import { Prop, Schema } from "@nestjs/mongoose";
import CategoryModel from "./sub/Category.model";

@Schema({ collection: "featured_categories" })
export default class FeaturedCategoryModel extends CategoryModel {
  @Prop({ type: String })
  image_url: string | null;

  @Prop({ index: true })
  product_count: number;
}
