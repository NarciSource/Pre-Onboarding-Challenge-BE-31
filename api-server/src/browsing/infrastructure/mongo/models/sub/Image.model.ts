import { Prop } from "@nestjs/mongoose";

export default class ImageModel {
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
