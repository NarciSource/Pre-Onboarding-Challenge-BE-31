import { FilterDTO } from "@shared/dto";

export default interface QueryHandler {
  find_all(dto: FilterDTO);

  find(id: number);
}
