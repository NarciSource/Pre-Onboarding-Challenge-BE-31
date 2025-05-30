import { Prop } from "@nestjs/mongoose";

import { Product_Image } from "@libs/domain/entities";

export default class ImageModel
  implements Omit<Product_Image, "product" | "product_id" | "option">
{
  @Prop()
  id: number;

  @Prop()
  url: string;

  @Prop({ type: String })
  alt_text: string | null;

  @Prop()
  is_primary: boolean;

  @Prop()
  display_order: number;

  @Prop({ type: Number })
  option_id: number | null;
}
