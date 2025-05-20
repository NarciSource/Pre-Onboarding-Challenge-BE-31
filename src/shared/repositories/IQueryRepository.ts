import { FilterQuery, UpdateQuery } from "mongoose";

export type FindOptions<T> = {
  where?: FilterQuery<T>;
  order?: { [key: string]: "ASC" | "DESC" };
  take?: number;
  skip?: number;
};

export default interface IQueryRepository<T> {
  find({ where, order, take, skip }: FindOptions<T>): Promise<T[]>;

  findOneBy(where: FilterQuery<T>): Promise<T | null>;

  save(data: Partial<T>): Promise<void>;

  update(id: number, data: UpdateQuery<T>): Promise<void>;

  updateMany(where: FilterQuery<T>, data: Partial<T>): Promise<void>;

  delete(id: number): Promise<void>;
}
