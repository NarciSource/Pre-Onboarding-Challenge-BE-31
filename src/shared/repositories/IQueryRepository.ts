import { FilterQuery } from "mongoose";

export type FindOptions<T> = {
  where?: FilterQuery<T>;
  order?: { [key: string]: "ASC" | "DESC" };
  take?: number;
  skip?: number;
};

export default interface IQueryRepository<T> {
  find({ where, order, take, skip }: FindOptions<T>): Promise<T[]>;

  findOneBy(where: FilterQuery<T>): Promise<T | null>;

  save(data: Partial<T>): Promise<T | null>;

  update(id: number, data: Partial<T>): Promise<T | null>;

  delete(id: number): Promise<T | null>;
}
