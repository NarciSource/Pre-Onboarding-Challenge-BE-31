import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { IQueryRepository } from "shared/repositories";
import { ProductCatalogModel } from "browsing/infrastructure/mongo/models";
import { ProductCatalogDTO } from "browsing/presentation/dto";
import FindQuery from "./Find.query";

@QueryHandler(FindQuery)
export default class FindHandler implements IQueryHandler<FindQuery> {
  constructor(
    @Inject("IProductCatalogQueryRepository")
    private readonly repository: IQueryRepository<ProductCatalogModel>,
  ) {}

  async execute({ id }: FindQuery) {
    const product = await this.repository.findOne({ id });

    if (!product) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Product", resourceId: id },
      });
    }
    return product as ProductCatalogDTO;
  }
}
