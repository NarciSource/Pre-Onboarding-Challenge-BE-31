import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IQueryRepository } from "@libs/domain/repository";
import { ProductSummaryModel } from "@libs/infrastructure/mongo/models";
import { FilterDTO } from "shared/dto";
import FindAllHandler from "./FindAll.handler";

describe("FindAllHandler", () => {
  let handler: FindAllHandler;
  let summaryRepository: IQueryRepository<ProductSummaryModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<FindAllHandler>(FindAllHandler);

    summaryRepository = module.get("IProductSummaryQueryRepository");
  });

  it("상품 목록 조회", async () => {
    const filterDTO: FilterDTO = {
      page: 1,
      per_page: 10,
      sort: "created_at:ASC",
      min_price: 100,
      max_price: 1000000,
      category: [1, 2],
      in_stock: true,
      search: "상품",
    };
    const mockProducts = [
      { id: 1, name: "상품1", slug: "product-1" },
      { id: 2, name: "상품2", slug: "product-2" },
    ];
    summaryRepository.find = jest.fn().mockResolvedValue(mockProducts);

    const result = await handler.execute({ dto: filterDTO });

    expect(result).toEqual({
      items: mockProducts,
      pagination: {
        total_items: mockProducts.length,
        total_pages: 1,
        current_page: 1,
        per_page: 10,
      },
    });
  });
});
