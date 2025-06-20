import getValidateDTO from "__test-utils__/getValidateDTO";

import {
  BrandDTO,
  ImageDTO,
  ProductDetailDTO,
  ProductPriceDTO,
  SellerDTO,
  TagDTO,
  ProductOptionGroupDTO,
} from "product/presentation/dto";
import ProductDTO from "./Product.dto";

describe("ProductCatalogDTO", () => {
  const validateDTO = getValidateDTO(ProductDTO);

  const validData: Partial<ProductDTO> = {
    id: 123,
    name: "슈퍼 편안한 소파",
    slug: "super-comfortable-sofa",
    short_description: "최고급 소재로 만든 편안한 소파",
    full_description: "<p>이 소파는 최고급 소재로 제작되었으며...</p>",
    status: "ACTIVE",
    created_at: new Date("2025-04-10T09:30:00Z"),
    updated_at: new Date("2025-04-14T10:15:00Z"),
    seller: {} as SellerDTO,
    brand: {} as BrandDTO,
    detail: {} as ProductDetailDTO,
    price: {} as ProductPriceDTO,
    option_groups: [{}] as ProductOptionGroupDTO[],
    images: [{}] as ImageDTO[],
    tags: [{}] as TagDTO[],
  };

  it("status 필드가 허용되지 않은 값일 경우 검증 실패", async () => {
    const invalidData = { ...validData, status: "INVALID_STATUS" };

    const errors = await validateDTO(invalidData);

    expect(errors).toContain("status");
  });

  it("images 필드가 배열이 아닌 경우 검증 실패", async () => {
    const invalidData = { ...validData, images: "not_an_array" as unknown as ImageDTO[] };

    const errors = await validateDTO(invalidData);

    expect(errors).toContain("images");
  });

  it("created_at 필드가 날짜 형식이 아닌 경우 검증 실패", async () => {
    const invalidData = { ...validData, created_at: "not_a_date" as unknown as Date };

    const errors = await validateDTO(invalidData);

    expect(errors).toContain("created_at");
  });

  it("updated_at 필드가 날짜 형식이 아닌 경우 검증 실패", async () => {
    const invalidData = { ...validData, updated_at: "not_a_date" as unknown as Date };

    const errors = await validateDTO(invalidData);

    expect(errors).toContain("updated_at");
  });

  it("tags 필드가 배열이 아닌 경우 검증 실패", async () => {
    const invalidData = { ...validData, tags: "not_an_array" as unknown as TagDTO[] };

    const errors = await validateDTO(invalidData);

    expect(errors).toContain("tags");
  });
});
