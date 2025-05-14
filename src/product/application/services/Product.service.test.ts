import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { Between, In, Like } from "typeorm";

import { get_module } from "__test-utils__/test-module";

import { FilterDTO } from "@shared/dto";
import { IBaseRepository, IBrowsingRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/entities";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/views";
import { ProductInputDTO } from "../command";
import ProductService from "./Product.service";

describe("ProductService", () => {
  let service: ProductService;
  let productRepository: IBaseRepository<ProductEntity>;
  let detailRepository: IBaseRepository<ProductEntity>;
  let priceRepository: IBaseRepository<ProductEntity>;
  let categoryRepository: IBaseRepository<ProductEntity>;
  let optionsRepository: IBaseRepository<ProductEntity>;
  let optionGroupRepository: IBaseRepository<ProductEntity>;
  let imageRepository: IBaseRepository<ProductEntity>;
  let tagRepository: IBaseRepository<ProductEntity>;
  let catalogRepository: IBrowsingRepository<ProductCatalogView>;
  let summaryRepository: IBrowsingRepository<ProductSummaryView>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    service = module.get<ProductService>(ProductService);

    productRepository = module.get("IProductRepository");
    detailRepository = module.get("IProductDetailRepository");
    priceRepository = module.get("IProductPriceRepository");
    categoryRepository = module.get("IProductCategoryRepository");
    optionsRepository = module.get("IProductOptionsRepository");
    optionGroupRepository = module.get("IProductOptionGroupRepository");
    imageRepository = module.get("IProductImageRepository");
    tagRepository = module.get("IProductTagRepository");
    catalogRepository = module.get("IProductCatalogRepository");
    summaryRepository = module.get("IProductSummaryRepository");

    productRepository.with_transaction = jest.fn().mockReturnValue(productRepository);
    detailRepository.with_transaction = jest.fn().mockReturnValue(detailRepository);
    priceRepository.with_transaction = jest.fn().mockReturnValue(priceRepository);
    categoryRepository.with_transaction = jest.fn().mockReturnValue(categoryRepository);
    optionsRepository.with_transaction = jest.fn().mockReturnValue(optionsRepository);
    optionGroupRepository.with_transaction = jest.fn().mockReturnValue(optionGroupRepository);
    imageRepository.with_transaction = jest.fn().mockReturnValue(imageRepository);
    tagRepository.with_transaction = jest.fn().mockReturnValue(tagRepository);
  });

  const options = [
    {
      name: "브라운",
      additional_price: 0,
      sku: "SOFA-BRN",
      stock: 10,
      display_order: 1,
    },
  ];
  const option_group = {
    name: "색상",
    display_order: 1,
  };
  const product = {
    name: "슈퍼 편안한 소파",
    slug: "super-comfortable-sofa",
    short_description: "최고급 소재로 만든 편안한 소파",
    full_description: "<p>이 소파는 최고급 소재로 제작되었으며...</p>",
    status: "ACTIVE",
  };
  const input: ProductInputDTO = {
    ...product,
    seller_id: 1,
    brand_id: 2,
    detail: {
      weight: 25.5,
      dimensions: {
        width: 200,
        height: 85,
        depth: 90,
      },
      materials: "가죽, 목재, 폼",
      country_of_origin: "대한민국",
      warranty_info: "2년 품질 보증",
      care_instructions: "마른 천으로 표면을 닦아주세요",
      additional_info: {
        assembly_required: true,
        assembly_time: "30분",
      },
    },
    price: {
      base_price: 599000,
      sale_price: 499000,
      cost_price: 350000,
      currency: "KRW",
      tax_rate: 10,
    },
    categories: [
      {
        category_id: 5,
        is_primary: true,
      },
    ],
    option_groups: [{ ...option_group, options }],
    images: [
      {
        option_id: null,
        url: "https://example.com/images/sofa1.jpg",
        alt_text: "브라운 소파 정면",
        is_primary: true,
        display_order: 1,
      },
    ],
    tags: [1, 4, 7],
  };

  describe("register", () => {
    it("상품 등록", async () => {
      // Arrange
      productRepository.save = jest.fn().mockResolvedValue({
        id: 1,
        name: "상품명",
        slug: "product-slug",
        created_at: new Date(),
        updated_at: new Date(),
      });
      detailRepository.save = jest.fn();
      priceRepository.save = jest.fn();
      categoryRepository.save = jest.fn();
      optionGroupRepository.save = jest
        .fn()
        .mockResolvedValue([{ id: 1, name: "색상", display_order: 1 }]);
      optionsRepository.save = jest.fn();
      imageRepository.save = jest.fn();
      tagRepository.save = jest.fn();

      // Act
      const result = await service.register(input);

      // Assert
      expect(productRepository.save).toHaveBeenCalledWith(expect.objectContaining(product));
      expect(detailRepository.save).toHaveBeenCalledWith(expect.objectContaining(input.detail));
      expect(priceRepository.save).toHaveBeenCalledWith(expect.objectContaining(input.price));
      expect(categoryRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ category: { id: 5 }, is_primary: true }),
        ]),
      );
      expect(optionGroupRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining(option_group)]),
      );
      expect(optionsRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining(options.map(expect.objectContaining)),
      );
      expect(imageRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining(
          input.images.map(
            ({ option_id: _option_id, ...image }) =>
              expect.objectContaining({
                ...image,
                option: { id: undefined },
                product: { id: 1 },
              }) as ProductEntity,
          ),
        ),
      );
      expect(result).toEqual(
        expect.objectContaining({ id: 1, name: "상품명", slug: "product-slug" }),
      );
    });
  });

  describe("find_all", () => {
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

      const result = await service.find_all(filterDTO);

      expect(result).toEqual({
        items: mockProducts,
        pagination: {
          total_items: mockProducts.length,
          total_pages: 1,
          current_page: 1,
          per_page: 10,
        },
      });
      expect(summaryRepository.find).toHaveBeenCalledWith({
        order: { created_at: "ASC" },
        skip: 0,
        take: 10,
        where: {
          base_price: Between(100, 1000000),
          categories: In([1, 2]),
          in_stock: true,
          name: Like("%상품%"),
          status: undefined,
        },
      });
    });

    it("상품 목록 조회 시 기본값 적용", async () => {
      const mockProducts = [
        { id: 1, name: "상품1", slug: "product-1" },
        { id: 2, name: "상품2", slug: "product-2" },
      ];
      summaryRepository.find = jest.fn().mockResolvedValue(mockProducts);

      const result = await service.find_all({});

      expect(result).toEqual({
        items: mockProducts,
        pagination: {
          total_items: mockProducts.length,
          total_pages: 1,
          current_page: 1,
          per_page: 10,
        },
      });
      expect(summaryRepository.find).toHaveBeenCalledWith({
        order: { created_at: "DESC" },
        skip: 0,
        take: 10,
        where: {
          base_price: Between(0, Number.MAX_SAFE_INTEGER),
          categories: In([]),
          in_stock: undefined,
          name: Like("%%"),
          status: undefined,
        },
      });
    });
  });

  describe("find", () => {
    it("상품 조회", async () => {
      const product = { id: 1, name: "상품명" };
      catalogRepository.findOneBy = jest.fn().mockResolvedValue(product);

      const result = await service.find(1);

      expect(result).toEqual(product);
      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it("상품 조회 실패 시 NotFoundException 발생", async () => {
      catalogRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const findPromise = service.find(1);

      await expect(findPromise).rejects.toThrow(NotFoundException);
      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("edit", () => {
    it("상품 수정", async () => {
      // Arrange
      const product_id = 2;
      productRepository.findOneBy = jest.fn().mockResolvedValue({
        id: product_id,
        name: "수정된 상품명",
        slug: "updated-slug",
        updated_at: new Date(),
      });
      productRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      detailRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      priceRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      categoryRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      optionGroupRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      optionsRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      imageRepository.update = jest.fn().mockResolvedValue({ affected: 1 });

      // Act
      const result = await service.edit(product_id, input);

      // Assert
      expect(detailRepository.update).toHaveBeenCalledWith(
        { product: { id: product_id } },
        expect.objectContaining(input.detail),
      );
      expect(priceRepository.update).toHaveBeenCalledWith(
        { product: { id: product_id } },
        expect.objectContaining(input.price),
      );
      expect(categoryRepository.update).toHaveBeenCalledWith(
        { product: { id: product_id }, category: { id: 5 } },
        { is_primary: true },
      );
      expect(productRepository.update).toHaveBeenCalledWith(
        { id: product_id },
        expect.objectContaining(product),
      );
      expect(result).toEqual(
        expect.objectContaining({ id: 2, name: "수정된 상품명", slug: "updated-slug" }),
      );
    });

    it("찾을 수 없는 상품으로 수정 시 NotFoundException 발생", async () => {
      const product_id = 2;
      productRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const editPromise = service.edit(product_id, input);

      await expect(editPromise).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("상품 삭제", async () => {
      productRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
      await service.remove(1);

      expect(productRepository.delete).toHaveBeenCalledWith(1);
    });

    it("상품 삭제 실패 시 NotFoundException 발생", async () => {
      productRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      const removePromise = service.remove(1);

      await expect(removePromise).rejects.toThrow(NotFoundException);
      expect(productRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
