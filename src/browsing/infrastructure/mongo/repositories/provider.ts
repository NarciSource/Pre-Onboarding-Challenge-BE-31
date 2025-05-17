import ProductCatalogQueryRepository from "./ProductCatalog.repository";

export default [
  {
    provide: "IProductCatalogQueryRepository",
    useClass: ProductCatalogQueryRepository,
  },
];
