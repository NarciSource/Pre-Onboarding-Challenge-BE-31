import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import IQueryRepository from "@shared/repositories/IQueryRepository";
import { ProductCatalogModel } from "../models";

@Injectable()
export default class CatalogRepository implements IQueryRepository<ProductCatalogModel> {
  constructor(
    @InjectModel(ProductCatalogModel.name)
    private readonly model: Model<ProductCatalogModel>,
  ) {}

  async findAll() {
    return this.model.find().exec();
  }

  async findById(id: number) {
    return this.model.findById(id).exec();
  }

  async create(data: Partial<ProductCatalogModel>) {
    return new this.model(data).save();
  }

  async update(id: string, data: Partial<ProductCatalogModel>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
