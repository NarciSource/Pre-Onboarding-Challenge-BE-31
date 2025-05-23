import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import {
  ParamDTO,
  ResponseDTO,
  ReviewBodyDTO,
  ReviewDTO,
  ReviewQueryDTO,
  ReviewResponseBundle,
  ReviewResponseDTO,
} from "../dto";
import ReviewController from "./Review.controller";

describe("ReviewController", () => {
  let controller: ReviewController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    controller = module.get(ReviewController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  describe("read", () => {
    it("상품 리뷰 조회 성공", async () => {
      const product_id = 1;
      const dto: ReviewQueryDTO = { page: 1, perPage: 10 };
      const mockData = { items: [], summary: {}, pagination: {} };
      queryBus.execute = jest.fn().mockResolvedValue(mockData);

      const result: ResponseDTO<ReviewResponseBundle> = await controller.read(
        { id: product_id } as ParamDTO,
        dto,
      );

      expect(queryBus.execute).toHaveBeenCalledWith({ product_id, dto });
      expect(result).toEqual({
        success: true,
        data: mockData,
        message: "상품 리뷰를 성공적으로 조회했습니다.",
      });
    });
  });

  describe("create", () => {
    it("리뷰 작성 성공", async () => {
      const product_id = 1;
      const dto: ReviewBodyDTO = { title: "좋은 상품", content: "만족합니다", rating: 5 };
      const mockData = { id: 1, ...dto };
      commandBus.execute = jest.fn().mockResolvedValue(mockData);

      const result: ResponseDTO<ReviewDTO> = await controller.create(
        { id: product_id } as ParamDTO,
        dto,
      );

      expect(commandBus.execute).toHaveBeenCalledWith({ product_id, dto });
      expect(result).toEqual({
        success: true,
        data: mockData,
        message: "리뷰가 성공적으로 작성되었습니다.",
      });
    });
  });

  describe("update", () => {
    it("리뷰 수정 성공", async () => {
      const id = 1;
      const dto: ReviewBodyDTO = { title: "수정된 제목", content: "수정된 내용", rating: 4 };
      const mockData = { id, ...dto };
      commandBus.execute = jest.fn().mockResolvedValue(mockData);

      const result: ResponseDTO<ReviewResponseDTO> = await controller.update(
        { id } as ParamDTO,
        dto,
      );

      expect(commandBus.execute).toHaveBeenCalledWith({ id, dto });
      expect(result).toEqual({
        success: true,
        data: mockData,
        message: "리뷰가 성공적으로 수정되었습니다.",
      });
    });
  });

  describe("delete", () => {
    it("리뷰 삭제 성공", async () => {
      const id = 1;
      commandBus.execute = jest.fn().mockResolvedValue(true);

      const result: ResponseDTO<null> = await controller.delete({ id } as ParamDTO);

      expect(commandBus.execute).toHaveBeenCalledWith({ id });
      expect(result).toEqual({
        success: true,
        data: null,
        message: "리뷰가 성공적으로 삭제되었습니다.",
      });
    });
  });
});
