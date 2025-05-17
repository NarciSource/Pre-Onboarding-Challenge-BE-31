import { FilterQuery } from "mongoose";

export default interface IQueryRepository<T> {
  find(filter?: FilterQuery<T>);

  findById(id: number);

  save(data: Partial<T>);

  update(id: number, data: Partial<T>);

  delete(id: number);
}
