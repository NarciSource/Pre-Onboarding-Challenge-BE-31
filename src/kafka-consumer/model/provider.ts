import { SchemaFactory } from "@nestjs/mongoose";

import CategoryModel from "./Category.model";
import TagModel from "./Tag.model";

export default [
  {
    name: CategoryModel.name,
    schema: SchemaFactory.createForClass(CategoryModel),
  },
  {
    name: TagModel.name,
    schema: SchemaFactory.createForClass(TagModel),
  },
];
