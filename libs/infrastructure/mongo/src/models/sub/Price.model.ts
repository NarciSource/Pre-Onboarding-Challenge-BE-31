import { Prop } from "@nestjs/mongoose";

import { Product_Price } from "@libs/domain/entities";

export default class PriceModel
  implements Omit<Product_Price, "id" | "product" | "product_id" | "cost_price">
{
  @Prop()
  base_price: number;

  @Prop({ type: Number })
  sale_price: number | null;

  @Prop()
  currency: string;

  @Prop({ type: Number })
  tax_rate: number | null;

  @Prop({ type: Number })
  discount_percentage: number | null;
}
