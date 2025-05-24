import { SchemaFactory } from "@nestjs/mongoose";

import FeaturedCategoryModel from "./FeaturedCategory.model";
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
    name: FeaturedCategoryModel.name,
    schema: SchemaFactory.createForClass(FeaturedCategoryModel),
  },
];
