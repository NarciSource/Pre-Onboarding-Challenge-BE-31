import { SchemaFactory } from "@nestjs/mongoose";

import FeaturedCategoryModel from "./FeaturedCategory.model";
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
    name: FeaturedCategoryModel.name,
    schema: SchemaFactory.createForClass(FeaturedCategoryModel),
  },
];
