import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import EditHandler from "./Edit.handler";

describe("EditHandler", () => {
  let handler: EditHandler;
  let repository: IBaseRepository<ReviewEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get<EditHandler>(EditHandler);

    repository = module.get("IReviewRepository");
    repository.with_transaction = jest.fn().mockReturnValue(repository);
  });

  it("리뷰 수정", async () => {
    const dto = { rating: 4, title: "리뷰 수정 제목", content: "수정된 리뷰" };
    const updatedReview = { id: 1, ...dto };
    repository.update = jest.fn().mockResolvedValue({ affected: 1 });
    repository.findOneBy = jest.fn().mockResolvedValue(updatedReview);

    const result = await handler.execute({
      id: 1,
      dto,
    });

    expect(result).toEqual(expect.objectContaining(updatedReview));
    expect(repository.update).toHaveBeenCalledWith(1, dto);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("리뷰 수정 실패 시 NotFoundException 발생", async () => {
    repository.update = jest.fn().mockResolvedValue({ affected: 0 });

    const updatePromise = handler.execute({
      id: 1,
      dto: { rating: 4, title: "리뷰 수정 제목", content: "수정된 리뷰" },
    });

    await expect(updatePromise).rejects.toThrow(NotFoundException);
  });
});
