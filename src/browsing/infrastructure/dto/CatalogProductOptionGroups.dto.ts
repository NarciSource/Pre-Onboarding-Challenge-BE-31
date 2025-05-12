import { ProductOptionEntity, ProductOptionGroupEntity } from "@product/infrastructure/entities";

type CatalogOptionGroup = Omit<ProductOptionEntity, "option_group">;

type CatalogOptionGroups = Omit<ProductOptionGroupEntity, "product"> & {
  options: CatalogOptionGroup[];
};

export default CatalogOptionGroups;
