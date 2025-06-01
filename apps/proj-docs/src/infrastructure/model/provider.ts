import { SchemaFactory } from "@nestjs/mongoose";

import BrandStateModel from "./BrandState.model";
import CategoryStateModel from "./CategoryState.model";
import SellerStateModel from "./SellerState.model";
import TagStateModel from "./TagState.model";

export default [
  {
    name: BrandStateModel.name,
    schema: SchemaFactory.createForClass(BrandStateModel),
  },
  {
    name: SellerStateModel.name,
    schema: SchemaFactory.createForClass(SellerStateModel),
  },
  {
    name: CategoryStateModel.name,
    schema: SchemaFactory.createForClass(CategoryStateModel),
  },
  {
    name: TagStateModel.name,
    schema: SchemaFactory.createForClass(TagStateModel),
  },
];
