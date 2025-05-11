import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { ReviewService } from "@review/application/services";
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
  let service: ReviewService;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    controller = module.get(ReviewController);
    service = module.get(ReviewService);
  });

  describe("read", () => {
    it("상품 리뷰 조회 성공", async () => {
      const id = 1;
      const query: ReviewQueryDTO = { page: 1, perPage: 10 };
      const mockData = { items: [], summary: {}, pagination: {} };
      service.find = jest.fn().mockResolvedValue(mockData);

      const result: ResponseDTO<ReviewResponseBundle> = await controller.read(
        { id } as ParamDTO,
        query,
      );

      expect(service.find).toHaveBeenCalledWith(id, query);
      expect(result).toEqual({
        success: true,
        data: mockData,
        message: "상품 리뷰를 성공적으로 조회했습니다.",
      });
    });
  });

  describe("create", () => {
    it("리뷰 작성 성공", async () => {
      const id = 1;
      const body: ReviewBodyDTO = { title: "좋은 상품", content: "만족합니다", rating: 5 };
      const mockData = { id: 1, ...body };
      service.register = jest.fn().mockResolvedValue(mockData);

      const result: ResponseDTO<ReviewDTO> = await controller.create({ id } as ParamDTO, body);

      expect(service.register).toHaveBeenCalledWith(id, body);
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
      const body: ReviewBodyDTO = { title: "수정된 제목", content: "수정된 내용", rating: 4 };
      const mockData = { id, ...body };
      service.edit = jest.fn().mockResolvedValue(mockData);

      const result: ResponseDTO<ReviewResponseDTO> = await controller.update(
        { id } as ParamDTO,
        body,
      );

      expect(service.edit).toHaveBeenCalledWith(id, body);
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
      service.remove = jest.fn().mockResolvedValue(true);

      const result: ResponseDTO<null> = await controller.delete({ id } as ParamDTO);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        success: true,
        data: null,
        message: "리뷰가 성공적으로 삭제되었습니다.",
      });
    });
  });
});
