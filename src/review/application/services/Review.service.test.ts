import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { ReviewEntity } from "@review/infrastructure/entities";
import { FilterDTO } from "../dto";
import ReviewService from "./Review.service";

describe("ReviewService", () => {
  let service: ReviewService;
  let repository: IBaseRepository<ReviewEntity>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    service = module.get(ReviewService);
    repository = module.get("IReviewRepository");
  });

  it("리뷰 조회", async () => {
    const reviews = [
      { id: 1, product_id: 1, rating: 5, content: "좋아요" },
      { id: 2, product_id: 1, rating: 4, content: "괜찮아요" },
    ];
    repository.find = jest.fn().mockResolvedValue(reviews);

    const filter: FilterDTO = { page: 1, per_page: 10, rating: 3, sort: "rating:DESC" };
    const result = await service.find(1, filter);

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

  it("리뷰 등록", async () => {
    const review = { rating: 5, content: "좋아요" };
    const savedReview = { id: 1, product_id: 1, ...review };
    repository.save = jest.fn().mockResolvedValue(savedReview);

    const result = await service.register(1, review);

    expect(result).toEqual(savedReview);
    expect(repository.save).toHaveBeenCalledWith({ product: { id: 1 }, ...review });
  });

  it("리뷰 수정", async () => {
    const review = { rating: 4, content: "수정된 리뷰" };
    const updatedReview = { id: 1, product_id: 1, ...review };
    repository.update = jest.fn().mockResolvedValue(true);
    repository.findOneBy = jest.fn().mockResolvedValue(updatedReview);

    const result = await service.edit(1, review);

    expect(result).toEqual(updatedReview);
    expect(repository.update).toHaveBeenCalledWith(1, review);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("리뷰 수정 실패 시 NotFoundException 발생", async () => {
    repository.update = jest.fn().mockResolvedValue(false);

    await expect(service.edit(1, { rating: 4, content: "수정된 리뷰" })).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.update).toHaveBeenCalledWith(1, { rating: 4, content: "수정된 리뷰" });
  });

  it("리뷰 삭제", async () => {
    repository.delete = jest.fn().mockResolvedValue(true);

    await service.remove(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("리뷰 삭제 실패 시 NotFoundException 발생", async () => {
    repository.delete = jest.fn().mockResolvedValue(false);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
