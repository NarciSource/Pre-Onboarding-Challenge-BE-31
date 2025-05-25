import { FilterDTO } from "shared/dto";

export default class FindProductsQuery {
  constructor(
    public readonly category_id: number,
    public readonly dto: FilterDTO,
  ) {}
}
