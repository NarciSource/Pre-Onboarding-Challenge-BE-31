import { Prop, Schema } from "@nestjs/mongoose";

import { Featured_Category } from "@libs/domain/entities";
import CategoryModel from "./sub/Category.model";

@Schema({ collection: "featured_category" })
export default class FeaturedCategoryModel extends CategoryModel implements Featured_Category {
  @Prop({ type: String })
  image_url: string | null;

  @Prop({ index: true })
  product_count: number;
}
