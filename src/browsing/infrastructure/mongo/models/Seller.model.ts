import { Prop } from "@nestjs/mongoose";

export default class SellerModel {
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
