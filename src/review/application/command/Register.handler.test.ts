import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { Review } from "@review/domain/entities";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import RegisterHandler from "./Register.handler";

describe("RegisterHandler", () => {
  let handler: RegisterHandler;

  let repository: IBaseRepository<ReviewEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(RegisterHandler);

    repository = module.get("IReviewRepository");
    repository.with_transaction = jest.fn().mockReturnValue(repository);
  });

  it("리뷰 등록", async () => {
    const dto: Pick<Review, "rating" | "title" | "content"> = {
      rating: 5,
      title: "리뷰 제목",
      content: "좋아요",
    };
    const savedReview = { id: 1, product_id: 1, ...dto };
    repository.save = jest.fn().mockResolvedValue(savedReview);
    repository.findOne = jest.fn().mockResolvedValue(savedReview);

    const result = await handler.execute({
      product_id: 1,
      dto,
    });

    expect(result).toEqual(savedReview);
    expect(repository.save).toHaveBeenCalledWith({ product: { id: 1 }, ...dto });
  });
});
