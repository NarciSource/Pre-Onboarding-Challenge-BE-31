import { Prop, Schema } from "@nestjs/mongoose";

import { CategoryModel } from "@libs/infrastructure/mongo/models";

@Schema({ collection: "featured_categories" })
export default class CategoryStateModel extends CategoryModel {
  @Prop({ type: Number })
  parent_id?: number | null;
  parent?: CategoryModel | null;

  @Prop({ type: String })
  image_url: string | null;

  @Prop()
  product_count: number;
}
