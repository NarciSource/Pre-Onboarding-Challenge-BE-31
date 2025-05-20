import { SchemaFactory } from "@nestjs/mongoose";

import CategoryModel from "./Category.model";

export default [
  {
    name: CategoryModel.name,
    schema: SchemaFactory.createForClass(CategoryModel),
  },
];
