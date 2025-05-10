import { DeepPartial, EntityManager } from "typeorm";

import IBaseRepository from "./IBaseRepository";

export default abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly entity_manager: EntityManager) {}

  with_transaction<M extends BaseRepository<T>>(this: M, manager: EntityManager): M {
    const Repository_Class = this.constructor as { new (manager: EntityManager): M };
    return new Repository_Class(manager);
  }

  save(param: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  saves(param: DeepPartial<T>[]): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  find_by_id(id: number): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  find_by_filters(filters: any): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  update(param: DeepPartial<T>, id?: number): Promise<T | boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
