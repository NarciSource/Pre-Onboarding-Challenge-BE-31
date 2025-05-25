import { FilterDTO } from "shared/dto";

export default class FindAllQuery {
  constructor(public readonly dto: FilterDTO) {}
}
