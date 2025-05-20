import { Injectable } from "@nestjs/common";
import { FilterQuery, Model, PipelineStage, UpdateQuery } from "mongoose";

import IQueryRepository, { FindOptions } from "./IQueryRepository";

@Injectable()
export default class QueryRepository<T> implements IQueryRepository<T> {
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

    const docs = await this.model.find(where).sort(sort).limit(take).skip(skip).lean().exec();

    return docs.map(({ _id, __v, ...rest }) => rest) as T[];
  }

  async findOneBy(where: FilterQuery<T>): Promise<T | null> {
    const docs = await this.model.findOne(where).lean().exec();

    if (!docs) {
      return null;
    }

    const { _id, __v, ...rest } = docs;
    return rest as T;
  }

  async save(data: Partial<T>) {
    await new this.model(data).save();
  }

  async update(id: number, data: UpdateQuery<T>) {
    await this.model.updateOne({ id }, data, { upsert: true }).exec();
  }

  async updateMany(where: FilterQuery<T>, data: Partial<T>) {
    await this.model.updateMany(where, data).exec();
  }

  async delete(id: number) {
    await this.model.deleteOne({ id }).exec();
  }

  async aggregate(pipeline?: PipelineStage[]) {
    const docs = await this.model.aggregate(pipeline).exec();

    return docs.map(({ _id, __v, ...rest }) => rest as T);
  }

  get model_name() {
    return this.model.collection.name;
  }
}
