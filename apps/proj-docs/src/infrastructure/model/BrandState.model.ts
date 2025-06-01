import { Prop, Schema } from "@nestjs/mongoose";

import { Brand } from "@libs/domain/entities";

@Schema()
export default class BrandStateModel implements Brand {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: String })
  description: string | null;

  @Prop({ type: String })
  logo_url: string | null;

  @Prop({ type: String })
  website: string | null;
}
