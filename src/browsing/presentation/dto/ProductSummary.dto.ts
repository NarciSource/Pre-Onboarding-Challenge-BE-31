import { ApiProperty, IntersectionType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsInt, IsNumber, Max, Min, ValidateNested } from "class-validator";

import BrandDTO from "@product/presentation/dto/model/Brand.dto";
import ImageDTO from "@product/presentation/dto/model/Image.dto";
import ProductDTO from "@product/presentation/dto/model/Product.dto";
import ProductPriceDTO from "@product/presentation/dto/model/ProductPrice.dto";
import SellerDTO from "@product/presentation/dto/model/Seller.dto";

class BrandDTOForProductSummary extends PickType(BrandDTO, ["id", "name"] as const) {}
class SellerDTOForProductSummary extends PickType(SellerDTO, ["id", "name"] as const) {}
class ImageDTOForProductSummary extends PickType(ImageDTO, ["url", "alt_text"] as const) {}
class ProductPriceDTOForProductSummary extends PickType(ProductPriceDTO, [
  "base_price",
  "sale_price",
  "currency",
] as const) {}
class ProductDTOForProductSummary extends PickType(ProductDTO, [
  "id",
  "name",
  "slug",
  "short_description",
  "status",
  "created_at",
] as const) {}

export default class ProductSummaryDTO extends IntersectionType(
  ProductDTOForProductSummary,
  ProductPriceDTOForProductSummary,
) {
  @ApiProperty({ description: "주 이미지", type: ImageDTOForProductSummary, nullable: true })
  @IsDefined()
  @ValidateNested()
  @Type(() => ImageDTOForProductSummary)
  primary_image: ImageDTOForProductSummary;

  @ApiProperty({ description: "브랜드", type: BrandDTOForProductSummary })
  @IsDefined()
  @ValidateNested()
  @Type(() => BrandDTOForProductSummary)
  brand: BrandDTOForProductSummary;

  @ApiProperty({ description: "판매자", type: SellerDTOForProductSummary })
  @IsDefined()
  @ValidateNested()
  @Type(() => SellerDTOForProductSummary)
  seller: SellerDTOForProductSummary;

  @ApiProperty({ description: "재고 유무", example: true })
  @IsBoolean()
  in_stock: boolean;

  @ApiProperty({ description: "리뷰 평균 평점", example: 4.7 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: "리뷰 수", example: 128 })
  @IsInt()
  @Min(0)
  review_count: number;
}
