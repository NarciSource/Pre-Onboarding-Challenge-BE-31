import { Injectable } from "@nestjs/common";
import { FilterQuery, Model, Document } from "mongoose";

import IQueryRepository from "@shared/repositories/IQueryRepository";

@Injectable()
export default class QueryRepository<T extends Document> implements IQueryRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async find(filter: FilterQuery<T> = {}) {
    return this.model.find(filter).exec();
  }

  async findById(id: number) {
    return this.model.findOne({ id }).exec();
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
