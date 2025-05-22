import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export default class CategoryCatalogModel extends Document {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: String })
  image_url: string | null;

  @Prop({ index: true })
  product_count: number;
}
