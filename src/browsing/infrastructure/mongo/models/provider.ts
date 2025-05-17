import { SchemaFactory } from "@nestjs/mongoose";

import ProductCatalogModel from "./ProductCatalog.model";

export default [
  {
    name: ProductCatalogModel.name,
    schema: SchemaFactory.createForClass(ProductCatalogModel),
  },
];
