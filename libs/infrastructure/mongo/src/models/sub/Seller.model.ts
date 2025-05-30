import { Prop } from "@nestjs/mongoose";

import { Seller } from "@libs/domain/entities";

export default class SellerModel implements Seller {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop({ type: String })
  description: string | null;

  @Prop({ type: String })
  logo_url: string | null;

  @Prop({ type: Number })
  rating: number | null;

  @Prop({ type: String })
  contact_email: string | null;

  @Prop({ type: String })
  contact_phone: string | null;
}
