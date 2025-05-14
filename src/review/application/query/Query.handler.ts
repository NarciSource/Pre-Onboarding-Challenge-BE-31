import { FilterDTO } from "@shared/dto";

export default interface QueryHandler {
  find(product_id: number, { page, per_page, sort, rating }: FilterDTO);
}
