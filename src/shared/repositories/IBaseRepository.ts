import { DeepPartial, EntityManager } from "typeorm";

export default interface IBaseRepository<T> {
  with_transaction(manager: EntityManager): this;

  save(param: T): Promise<T>;
  saves(param: DeepPartial<T>[]): Promise<T[]>;
  find_by_id(id: number): Promise<T | null>;
  find_by_filters(filters: any): Promise<T[]>;
  update(param: DeepPartial<T>, id?: number): Promise<T | boolean>;
  delete(id: number): Promise<boolean>;
}
