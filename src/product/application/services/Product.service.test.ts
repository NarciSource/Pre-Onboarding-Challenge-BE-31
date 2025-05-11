import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { Between, EntityManager, In, Like } from "typeorm";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository, IBrowsingRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/entities";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/views";
import { FilterDTO, ProductInputDTO } from "../dto";
import ProductService from "./Product.service";

describe("ProductService", () => {
  let service: ProductService;
  let entityManager: EntityManager;
  let productRepository: IBaseRepository<ProductEntity>;
  let productDetailRepository: IBaseRepository<ProductEntity>;
  let productPriceRepository: IBaseRepository<ProductEntity>;
  let productCategoryRepository: IBaseRepository<ProductEntity>;
  let productOptionsRepository: IBaseRepository<ProductEntity>;
  let productOptionGroupRepository: IBaseRepository<ProductEntity>;
  let productImageRepository: IBaseRepository<ProductEntity>;
  let productTagRepository: IBaseRepository<ProductEntity>;
  let productCatalogRepository: IBrowsingRepository<ProductCatalogView>;
  let productSummaryRepository: IBrowsingRepository<ProductSummaryView>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    service = module.get<ProductService>(ProductService);
    entityManager = module.get(EntityManager);
    productRepository = module.get("IProductRepository");
    productDetailRepository = module.get("IProductDetailRepository");
    productPriceRepository = module.get("IProductPriceRepository");
    productCategoryRepository = module.get("IProductCategoryRepository");
    productOptionsRepository = module.get("IProductOptionsRepository");
    productOptionGroupRepository = module.get("IProductOptionGroupRepository");
    productImageRepository = module.get("IProductImageRepository");
    productTagRepository = module.get("IProductTagRepository");
    productCatalogRepository = module.get("IProductCatalogRepository");
    productSummaryRepository = module.get("IProductSummaryRepository");
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
        url: "https://example.com/images/sofa1.jpg",
        alt_text: "브라운 소파 정면",
        is_primary: true,
        display_order: 1,
      },
    ],
    tags: [1, 4, 7],
  };

  it("상품 등록", async () => {
    // Arrange
    const mockProductSave = jest.fn().mockResolvedValue({
      id: 1,
      name: "상품명",
      slug: "product-slug",
      created_at: new Date(),
      updated_at: new Date(),
    });
    const mockProductDetailSave = jest.fn();
    const mockProductPriceSave = jest.fn();
    const mockProductCategorySave = jest.fn();
    const mockProductOptionGroupSave = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "색상", display_order: 1 }]);
    const mockProductOptionsSave = jest.fn();
    const mockProductImageSave = jest.fn();
    const mockProductTagSave = jest.fn();

    productRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductSave,
    });
    productDetailRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductDetailSave,
    });
    productPriceRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductPriceSave,
    });
    productCategoryRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductCategorySave,
    });
    productOptionGroupRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductOptionGroupSave,
    });
    productOptionsRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductOptionsSave,
    });
    productImageRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductImageSave,
    });
    productTagRepository.with_transaction = jest.fn().mockReturnValue({
      save: mockProductTagSave,
    });

    // Act
    const result = await service.register(input);

    // Assert
    expect(mockProductSave).toHaveBeenCalledWith(expect.objectContaining(product));
    expect(mockProductDetailSave).toHaveBeenCalledWith(expect.objectContaining(input.detail));
    expect(mockProductPriceSave).toHaveBeenCalledWith(expect.objectContaining(input.price));
    expect(mockProductCategorySave).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ category: { id: 5 }, is_primary: true })]),
    );
    expect(mockProductOptionGroupSave).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining(option_group)]),
    );
    expect(mockProductOptionsSave).toHaveBeenCalledWith(
      expect.arrayContaining(options.map(expect.objectContaining)),
    );
    expect(mockProductImageSave).toHaveBeenCalledWith(
      expect.arrayContaining(input.images.map(expect.objectContaining)),
    );
    expect(result).toEqual(
      expect.objectContaining({ id: 1, name: "상품명", slug: "product-slug" }),
    );
  });

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
    productSummaryRepository.find = jest.fn().mockResolvedValue(mockProducts);

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
    expect(productSummaryRepository.find).toHaveBeenCalledWith({
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
    productSummaryRepository.find = jest.fn().mockResolvedValue(mockProducts);

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
    expect(productSummaryRepository.find).toHaveBeenCalledWith({
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

  it("상품 조회", async () => {
    const product = { id: 1, name: "상품명" };
    productCatalogRepository.findOne = jest.fn().mockResolvedValue(product);

    const result = await service.find(1);

    expect(result).toEqual(product);
    expect(productCatalogRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("상품 조회 실패 시 NotFoundException 발생", async () => {
    productCatalogRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.find(1)).rejects.toThrow(NotFoundException);
    expect(productCatalogRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("상품 수정", async () => {
    // Arrange
    const product_id = 2;
    const mockProductDetailUpdate = jest.fn();
    const mockProductPriceUpdate = jest.fn();
    const mockProductCategoryUpdate = jest.fn();
    const mockProductUpdate = jest.fn().mockResolvedValue(true);

    productDetailRepository.with_transaction = jest.fn().mockReturnValue({
      update: mockProductDetailUpdate,
    });
    productPriceRepository.with_transaction = jest.fn().mockReturnValue({
      update: mockProductPriceUpdate,
    });
    productCategoryRepository.with_transaction = jest.fn().mockReturnValue({
      update: mockProductCategoryUpdate,
    });
    productRepository.with_transaction = jest.fn().mockReturnValue({
      update: mockProductUpdate,
    });
    productCatalogRepository.findOne = jest.fn().mockResolvedValue({
      id: product_id,
      name: "수정된 상품명",
      slug: "updated-slug",
      updated_at: new Date(),
    });

    // Act
    const result = await service.edit(product_id, input);

    // Assert
    expect(mockProductDetailUpdate).toHaveBeenCalledWith(
      product_id,
      expect.objectContaining(input.detail),
    );
    expect(mockProductPriceUpdate).toHaveBeenCalledWith(
      product_id,
      expect.objectContaining(input.price),
    );
    expect(mockProductCategoryUpdate).toHaveBeenCalledWith(
      { product: { id: product_id } },
      { category: { id: 5 }, is_primary: true },
    );
    expect(mockProductUpdate).toHaveBeenCalledWith(
      { product: { id: product_id } },
      expect.objectContaining(product),
    );
    expect(result).toEqual(
      expect.objectContaining({ id: 2, name: "수정된 상품명", slug: "updated-slug" }),
    );
  });

  it("상품 수정 실패 시 NotFoundException 발생", async () => {
    entityManager.transaction = jest.fn().mockResolvedValue(false);

    await expect(service.edit(1, {} as ProductInputDTO)).rejects.toThrow(NotFoundException);
  });

  it("상품 삭제", async () => {
    productRepository.delete = jest.fn().mockResolvedValue(true);
    await service.remove(1);

    expect(productRepository.delete).toHaveBeenCalledWith(1);
  });

  it("상품 삭제 실패 시 NotFoundException 발생", async () => {
    productRepository.delete = jest.fn().mockResolvedValue(false);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    expect(productRepository.delete).toHaveBeenCalledWith(1);
  });
});
