import { Prop } from "@nestjs/mongoose";

import { Brand } from "@libs/domain/entities";

export default class BrandModel implements Omit<Brand, "slug"> {
  @Prop()
  id: number;

  @Prop()
  name: string;

  slug: string;

  @Prop({ type: String })
  description: string | null;

  @Prop({ type: String })
  logo_url: string | null;

  @Prop({ type: String })
  website: string | null;
}
