import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export default class ImageModel {
  @Prop({ unique: true })
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
