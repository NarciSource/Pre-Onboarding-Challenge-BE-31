import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@libs/domain/repository";
import { ReviewEntity } from "@libs/infrastructure/rdb/entities";
import { FilterDTO } from "shared/dto";
import FindHandler from "./Find.handler";

describe("FindHandler", () => {
  let handler: FindHandler;
  let repository: IBaseRepository<ReviewEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<FindHandler>(FindHandler);

    repository = module.get("IReviewRepository");
    repository.with_transaction = jest.fn().mockReturnValue(repository);
  });

  it("리뷰 조회", async () => {
    const reviews = [
      { id: 1, product_id: 1, rating: 5, content: "좋아요" },
      { id: 2, product_id: 1, rating: 4, content: "괜찮아요" },
    ];
    repository.find = jest.fn().mockResolvedValue(reviews);

    const dto: FilterDTO = { page: 1, per_page: 10, rating: 3, sort: "rating:DESC" };

    const result = await handler.execute({ product_id: 1, dto });

    expect(result.items).toEqual(reviews);
    expect(result.summary.average).toBe(4.5);
    expect(result.summary.count).toBe(2);
    expect(result.summary.distribution[5]).toBe(1);
    expect(result.summary.distribution[4]).toBe(1);
    expect(repository.find).toHaveBeenCalledWith({
      where: {
        product: { id: 1 },
        rating: 3,
      },
      relations: ["user"],
      order: { rating: "DESC" },
      skip: 0,
      take: 10,
    });
  });
});
