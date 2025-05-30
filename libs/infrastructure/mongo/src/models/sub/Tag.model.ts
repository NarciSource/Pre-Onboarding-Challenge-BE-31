import { Prop } from "@nestjs/mongoose";

import { Tag } from "@libs/domain/entities";

export default class TagModel implements Tag {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}
