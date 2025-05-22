import { SchemaFactory } from "@nestjs/mongoose";

import CategoryCatalogModel from "./CategoryCatalog.model";
import ProductCatalogModel from "./ProductCatalog.model";
import ProductSummaryModel, { ProductSummarySchema } from "./ProductSummary.model";

export default [
  {
    name: ProductCatalogModel.name,
    schema: SchemaFactory.createForClass(ProductCatalogModel),
  },
  {
    name: ProductSummaryModel.name,
    schema: ProductSummarySchema,
  },
  {
    name: CategoryCatalogModel.name,
    schema: SchemaFactory.createForClass(CategoryCatalogModel),
  },
];
