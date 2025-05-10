import { Test, TestingModule } from "@nestjs/testing";
import { EntityManager, UpdateResult } from "typeorm";

import { ProductPriceEntity } from "../entities";
import ProductPriceRepository from "./Product_Price.repository";

describe("ProductPriceRepository", () => {
  let repository: ProductPriceRepository;
  const mockEntityManager = global.mockEntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPriceRepository,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    repository = module.get<ProductPriceRepository>(ProductPriceRepository);
  });

  describe("save", () => {
    it("상품 가격 저장 성공", async () => {
      const price = { product: { id: 100 }, base_price: 2000 } as ProductPriceEntity;
      const mockSavedEntity = { price: 2000, product: { id: 100 } };

      mockEntityManager.save.mockResolvedValueOnce(mockSavedEntity);

      const result = await repository.save(price);

      expect(result).toEqual(mockSavedEntity);
    });
  });

  describe("update", () => {
    it("상품 가격 업데이트 성공", async () => {
      const productPrice = { product: { id: 100 }, base_price: 3000 } as ProductPriceEntity;
      mockEntityManager.update.mockResolvedValueOnce({ affected: 1 } as UpdateResult);

      const result = await repository.update(productPrice, 1);

      expect(result).toBe(true);
    });

    it("상품 가격 업데이트 실패", async () => {
      const productPrice = { product: { id: 100 }, base_price: 3000 } as ProductPriceEntity;
      mockEntityManager.update.mockResolvedValueOnce({ affected: 0 } as UpdateResult);

      const result = await repository.update(productPrice, 1);

      expect(result).toBe(false);
    });
  });
});
