import { Test, TestingModule } from "@nestjs/testing";
import { EntityManager, UpdateResult } from "typeorm";

import { ProductOptionEntity } from "../entities";
import ProductOptionsRepository from "./Product_Options.repository";

describe("ProductOptionsRepository", () => {
  let repository: ProductOptionsRepository;
  const mockEntityManager = global.mockEntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductOptionsRepository,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    repository = module.get<ProductOptionsRepository>(ProductOptionsRepository);
  });

  describe("save", () => {
    it("상품 옵션 저장 성공", async () => {
      const option = { id: 1, name: "빨강", option_group: { id: 10 } } as ProductOptionEntity;
      const mockSavedEntity = { id: 1, name: "빨강", option_group: { id: 10 } };

      mockEntityManager.save.mockResolvedValue(mockSavedEntity);

      const result = await repository.save(option);

      expect(result).toEqual(mockSavedEntity);
    });
  });

  describe("saves", () => {
    it("상품 옵션 묶음 저장 성공", async () => {
      const options = [
        { id: 1, name: "빨강", option_group: { id: 10 } },
        { id: 2, name: "파랑", option_group: { id: 10 } },
      ] as ProductOptionEntity[];
      const mockSavedEntity = { id: 1, name: "빨강", option_group: { id: 10 } };

      mockEntityManager.save.mockResolvedValue(mockSavedEntity);

      const result = await repository.saves(options);

      expect(result).toEqual(mockSavedEntity);
    });
  });

  describe("update", () => {
    it("상품 옵션 업데이트 성공", async () => {
      const option = { name: "파랑" } as ProductOptionEntity;
      const optionId = 1;

      mockEntityManager.update.mockResolvedValue({ affected: true });

      const result = await repository.update(option, optionId);

      expect(result).toEqual(true);
    });
  });

  describe("delete", () => {
    it("상품 옵션 삭제 성공", async () => {
      const optionId = 1;

      mockEntityManager.delete.mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await repository.delete(optionId);

      expect(result).toBe(true);
    });

    it("상품 옵션 삭제 실패", async () => {
      const optionId = 1;

      mockEntityManager.delete.mockResolvedValue({ affected: 0 } as UpdateResult);

      const result = await repository.delete(optionId);

      expect(result).toBe(false);
    });
  });
});
