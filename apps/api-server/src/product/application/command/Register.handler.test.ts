import { TestingModule } from "@nestjs/testing";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "shared/repositories";
import { ProductEntity } from "product/infrastructure/rdb/entities";
import RegisterHandler from "./Register.handler";

describe("RegisterHandler", () => {
  let handler: RegisterHandler;

  let productRepository: IBaseRepository<ProductEntity>;
  let detailRepository: IBaseRepository<ProductEntity>;
  let priceRepository: IBaseRepository<ProductEntity>;
  let categoryRepository: IBaseRepository<ProductEntity>;
  let optionsRepository: IBaseRepository<ProductEntity>;
  let optionGroupRepository: IBaseRepository<ProductEntity>;
  let imageRepository: IBaseRepository<ProductEntity>;
  let tagRepository: IBaseRepository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(RegisterHandler);

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
    const result = await handler.execute({ dto: input });

    // Assert
    expect(productRepository.save).toHaveBeenCalledWith(expect.objectContaining(product));
    expect(detailRepository.save).toHaveBeenCalledWith(expect.objectContaining(input.detail));
    expect(priceRepository.save).toHaveBeenCalledWith(expect.objectContaining(input.price));
    expect(categoryRepository.save).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ category: { id: 5 }, is_primary: true })]),
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
