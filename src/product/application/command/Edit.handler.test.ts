import { NotFoundException } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { IBaseRepository } from "@shared/repositories";
import { ProductEntity } from "@product/infrastructure/entities";
import EditHandler from "./Edit.handler";

describe("EditHandler", () => {
  let handler: EditHandler;
  let productRepository: IBaseRepository<ProductEntity>;
  let detailRepository: IBaseRepository<ProductEntity>;
  let priceRepository: IBaseRepository<ProductEntity>;
  let categoryRepository: IBaseRepository<ProductEntity>;
  let optionsRepository: IBaseRepository<ProductEntity>;
  let optionGroupRepository: IBaseRepository<ProductEntity>;
  let imageRepository: IBaseRepository<ProductEntity>;
  let tagRepository: IBaseRepository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    handler = module.get<EditHandler>(EditHandler);

    productRepository = module.get("IProductRepository");
    detailRepository = module.get("IProductDetailRepository");
    priceRepository = module.get("IProductPriceRepository");
    categoryRepository = module.get("IProductCategoryRepository");
    optionsRepository = module.get("IProductOptionsRepository");
    optionGroupRepository = module.get("IProductOptionGroupRepository");
    imageRepository = module.get("IProductImageRepository");
    tagRepository = module.get("IProductTagRepository");

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
  const input = {
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
    optionsRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
    optionGroupRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
    imageRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
    tagRepository.delete = jest.fn();
    tagRepository.save = jest.fn();

    // Act
    const result = await handler.execute({ id: product_id, dto: input });

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

    const editPromise = handler.execute({ id: product_id, dto: input });

    await expect(editPromise).rejects.toThrow(NotFoundException);
  });
});
