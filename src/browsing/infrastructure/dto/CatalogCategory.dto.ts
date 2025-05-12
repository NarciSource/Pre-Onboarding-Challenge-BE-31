import { CategoryEntity } from "@category/infrastructure/entities";

type SimpleCategoryDTO = Pick<CategoryEntity, "id" | "name" | "slug">;

type CatalogCategoryDTO = SimpleCategoryDTO & {
  is_primary: boolean;
  parent: SimpleCategoryDTO | null;
};

export default CatalogCategoryDTO;
