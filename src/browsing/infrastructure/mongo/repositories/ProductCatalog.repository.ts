import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import IQueryRepository from "@shared/repositories/IQueryRepository";
import { ProductCatalogModel } from "../models";

@Injectable()
export default class ProductCatalogRepository implements IQueryRepository<ProductCatalogModel> {
  constructor(
    @InjectModel(ProductCatalogModel.name)
    private readonly model: Model<ProductCatalogModel>,
  ) {}

  async find(filter: FilterQuery<ProductCatalogModel> = {}) {
    return this.model.find(filter).exec();
  }

  async findById(id: number) {
    return this.model.findOne({ id }).exec();
  }

  async save(data: Partial<ProductCatalogModel>) {
    return new this.model(data).save();
  }

  async update(id: number, data: Partial<ProductCatalogModel>) {
    return this.model.findOneAndUpdate({ id }, data, { new: true }).exec();
  }

  async delete(id: number) {
    return this.model.findOneAndDelete({ id }).exec();
  }
}
