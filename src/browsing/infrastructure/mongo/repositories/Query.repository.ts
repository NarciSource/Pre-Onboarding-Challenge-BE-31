import { Injectable } from "@nestjs/common";
import { FilterQuery, Model, Document } from "mongoose";

import IQueryRepository, { FindOptions } from "@shared/repositories/IQueryRepository";

@Injectable()
export default class QueryRepository<T extends Document> implements IQueryRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async find({ where = {}, order = {}, take = 0, skip = 0 }: FindOptions<T>): Promise<T[]> {
    const sort = {};
    for (const key in order) {
      if (order[key] === "ASC") {
        sort[key] = 1;
      } else if (order[key] === "DESC") {
        sort[key] = -1;
      }
    }

    return this.model.find(where).sort(sort).limit(take).skip(skip).exec() as Promise<T[]>;
  }

  async findOneBy(where: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(where).exec() as Promise<T>;
  }

  async save(data: Partial<T>) {
    return new this.model(data).save();
  }

  async update(id: number, data: Partial<T>) {
    return this.model.findOneAndUpdate({ id }, data, { new: true }).exec();
  }

  async delete(id: number) {
    return this.model.findOneAndDelete({ id }).exec();
  }
}
