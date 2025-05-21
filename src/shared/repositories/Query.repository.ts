import { Injectable } from "@nestjs/common";
import {
  FilterQuery,
  Model,
  MongooseBaseQueryOptions,
  MongooseUpdateQueryOptions,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";

import IQueryRepository, { FindOptions } from "./IQueryRepository";

@Injectable()
export default class QueryRepository<T> implements IQueryRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async find(
    { where = {}, order = {}, take = 0, skip = 0 }: FindOptions<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T[]> {
    const sort = {};
    for (const key in order) {
      if (order[key] === "ASC") {
        sort[key] = 1;
      } else if (order[key] === "DESC") {
        sort[key] = -1;
      }
    }

    const docs = await this.model
      .find(where, projection, options)
      .sort(sort)
      .limit(take)
      .skip(skip)
      .lean()
      .exec();

    return docs.map(({ _id, __v, ...rest }) => rest) as T[];
  }

  async findOne(
    where: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    const docs = await this.model.findOne(where, projection, options).lean().exec();

    if (!docs) {
      return null;
    }

    const { _id, __v, ...rest } = docs;
    return rest as T;
  }

  async save(data: Partial<T>) {
    await new this.model(data).save();
  }

  async updateOne(
    where: FilterQuery<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: MongooseUpdateQueryOptions<T>,
  ) {
    return await this.model.updateOne(where, data, { upsert: true, ...options }).exec();
  }

  async update(
    where: FilterQuery<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: MongooseUpdateQueryOptions<T>,
  ) {
    return await this.model.updateMany(where, data, options).exec();
  }

  async delete(filter?: FilterQuery<T>, options?: MongooseBaseQueryOptions<T>) {
    await this.model.deleteOne(filter, options).exec();
  }

  async aggregate(pipeline?: PipelineStage[]) {
    const docs = await this.model.aggregate(pipeline).exec();

    return docs.map(({ _id, __v, ...rest }) => rest as T);
  }

  get model_name() {
    return this.model.collection.name;
  }
}
