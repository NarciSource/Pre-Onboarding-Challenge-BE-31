import { FilterDTO } from "@shared/dto";

export default interface QueryHandler {
  find_all_as_tree(level: number);

  find_products_by_category_id(category_id: number, { page, per_page, sort, has_sub }: FilterDTO);
}
