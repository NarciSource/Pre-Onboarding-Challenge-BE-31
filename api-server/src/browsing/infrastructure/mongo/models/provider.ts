import { SchemaFactory } from "@nestjs/mongoose";

import CategoryCatalogModel from "./CategoryCatalog.model";
import ProductCatalogModel from "./ProductCatalog.model";
import ProductSummaryModel from "./ProductSummary.model";

export default [
  {
    name: ProductCatalogModel.name,
    schema: SchemaFactory.createForClass(ProductCatalogModel),
  },
  {
    name: ProductSummaryModel.name,
    schema: SchemaFactory.createForClass(ProductSummaryModel),
  },
  {
    name: CategoryCatalogModel.name,
    schema: SchemaFactory.createForClass(CategoryCatalogModel),
  },
];
