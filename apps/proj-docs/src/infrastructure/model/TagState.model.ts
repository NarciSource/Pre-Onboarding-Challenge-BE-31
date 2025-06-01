import { Prop, Schema } from "@nestjs/mongoose";

import { Tag } from "@libs/domain/entities";

@Schema()
export default class TagStateModel implements Tag {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}
