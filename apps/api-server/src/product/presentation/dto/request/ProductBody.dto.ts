import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDefined, IsInt, ValidateNested } from "class-validator";

import ImageDTO from "../model/Image.dto";
import ProductDTO from "../model/Product.dto";
import ProductOptionGroupDTO from "../model/ProductOptionGroup.dto";
import ProductPriceDTO from "../model/ProductPrice.dto";
import ProductOptionBodyDTO from "./ProductOptionBody.dto";

class CategoryOfProductBodyDTO {
  @ApiProperty({ description: "카테고리 ID", example: 5 })
  @IsInt()
  category_id: number;

  @ApiProperty({ description: "대표 카테고리 여부", example: true })
  @IsBoolean()
  is_primary: boolean;
}

type TagId = number;

class PriceForProductBodyDTO extends OmitType(ProductPriceDTO, ["discount_percentage"] as const) {}

class ProductOptionGroupForBodyDTO extends OmitType(ProductOptionGroupDTO, [
  "id",
  "options",
] as const) {
  @ApiProperty({ description: "옵션 목록", type: [ProductOptionBodyDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionBodyDTO)
  options: ProductOptionBodyDTO[];
}

class ImageForBodyDTO extends OmitType(ImageDTO, ["id"] as const) {}

export default class ProductBodyDTO extends PickType(ProductDTO, [
  "name",
  "slug",
  "short_description",
  "full_description",
  "status",
  "detail",
]) {
  @ApiProperty({ description: "판매자 ID", example: 1 })
  @IsInt()
  seller_id: number;

  @ApiProperty({ description: "브랜드 ID", example: 2 })
  @IsInt()
  brand_id: number;

  @ApiProperty({ description: "가격 정보", type: PriceForProductBodyDTO })
  @IsDefined()
  @ValidateNested()
  @Type(() => PriceForProductBodyDTO)
  price: PriceForProductBodyDTO;

  @ApiProperty({ description: "카테고리 목록", type: [CategoryOfProductBodyDTO] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CategoryOfProductBodyDTO)
  categories: CategoryOfProductBodyDTO[];

  @ApiProperty({ description: "옵션 그룹 목록", type: [ProductOptionGroupForBodyDTO] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ProductOptionGroupForBodyDTO)
  option_groups: ProductOptionGroupForBodyDTO[];

  @ApiProperty({ description: "이미지 목록", type: [ImageForBodyDTO] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ImageForBodyDTO)
  images: ImageForBodyDTO[];

  @ApiProperty({ description: "태그 목록", example: [1, 4, 7] })
  @IsArray()
  @IsInt({ each: true })
  tags: TagId[];
}
