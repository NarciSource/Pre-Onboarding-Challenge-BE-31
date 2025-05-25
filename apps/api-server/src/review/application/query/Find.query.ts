import { FilterDTO } from "shared/dto";

export default class FindQuery {
  constructor(
    public readonly product_id: number,
    public readonly dto: FilterDTO,
  ) {}
}
