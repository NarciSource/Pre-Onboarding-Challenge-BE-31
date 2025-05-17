import { ProductCatalogModel } from "../models";
import { createQueryRepositoryProvider } from "./createRepositoryProvider";

export default [
  createQueryRepositoryProvider("IProductCatalogQueryRepository", ProductCatalogModel),
];
