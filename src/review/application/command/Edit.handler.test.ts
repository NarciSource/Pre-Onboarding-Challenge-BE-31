import { NotFoundException } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { Review } from "@review/domain/entities";
import { ReviewEntity } from "@review/infrastructure/rdb/entities";
import { QueryUpdateEvent } from "@browsing/application/event";
import EditHandler from "./Edit.handler";

describe("EditHandler", () => {
  let handler: EditHandler;
  let event_bus: EventBus;

  let repository: IBaseRepository<ReviewEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(EditHandler);
    event_bus = module.get(EventBus);

    repository = module.get("IReviewRepository");
    repository.with_transaction = jest.fn().mockReturnValue(repository);
  });

  it("리뷰 수정", async () => {
    const dto: Pick<Review, "rating" | "title" | "content"> = {
      rating: 4,
      title: "리뷰 수정 제목",
      content: "수정된 리뷰",
    };
    const updatedReview = { id: 1, product: { id: 2 }, ...dto };
    repository.update = jest.fn().mockResolvedValue({ affected: 1 });
    repository.findOne = jest.fn().mockResolvedValue(updatedReview);

    const result = await handler.execute({
      id: 1,
      dto,
    });

    expect(result).toEqual(expect.objectContaining({ id: 1, ...dto }));
    expect(repository.update).toHaveBeenCalledWith(1, dto);
    expect(event_bus.publish).toHaveBeenCalledWith(expect.any(QueryUpdateEvent));
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
