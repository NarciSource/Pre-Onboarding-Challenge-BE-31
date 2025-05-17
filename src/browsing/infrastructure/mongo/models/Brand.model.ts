import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export default class BrandModel {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop({ type: String })
  description: string | null;

  @Prop({ type: String })
  logo_url: string | null;

  @Prop({ type: String })
  website: string | null;
}
