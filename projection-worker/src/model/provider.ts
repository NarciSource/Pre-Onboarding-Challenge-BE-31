import { SchemaFactory } from "@nestjs/mongoose";

import CategoryStateModel from "./CategoryState.model";
import TagStateModel from "./TagState.model";

export default [
  {
    name: CategoryStateModel.name,
    schema: SchemaFactory.createForClass(CategoryStateModel),
  },
  {
    name: TagStateModel.name,
    schema: SchemaFactory.createForClass(TagStateModel),
  },
];
