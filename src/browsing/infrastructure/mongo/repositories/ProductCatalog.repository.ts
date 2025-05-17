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
    return this.model.findById(id).exec();
  }

  async save(data: Partial<ProductCatalogModel>) {
    return new this.model(data).save();
  }

  async update(id: number, data: Partial<ProductCatalogModel>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: number) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
