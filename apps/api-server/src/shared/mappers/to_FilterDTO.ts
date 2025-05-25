import { ProductQueryDTO } from "product/presentation/dto";
import { CategoryQueryDTO } from "category/presentation/dto";
import { ReviewQueryDTO } from "review/presentation/dto";
import { FilterDTO } from "../dto";

const field_mapping = {
  includeSubcategories: "has_sub",
  inStock: "in_stock",
  minPrice: "min_price",
  maxPrice: "max_price",
};

export default function to_FilterDTO(
  query: ProductQueryDTO | CategoryQueryDTO | ReviewQueryDTO,
): FilterDTO {
  return Object.entries(query).reduce((acc, [field, value]) => {
    const mapped_field = (field in field_mapping ? field_mapping[field] : field) as keyof FilterDTO;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    acc[mapped_field] = value;
    return acc;
  }, {} as FilterDTO);
}
