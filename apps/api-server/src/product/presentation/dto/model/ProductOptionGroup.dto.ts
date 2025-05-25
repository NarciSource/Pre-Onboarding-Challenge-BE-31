import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, Min, ValidateNested } from "class-validator";

import ProductOptionDTO from "./ProductOption.dto";

class ProductOptionDTOForProductCatalog extends OmitType(ProductOptionDTO, [
  "option_group_id",
] as const) {}

export default class ProductOptionGroupDTO {
  @ApiProperty({ description: "옵션 그룹 ID", example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: "옵션 그룹 이름", example: "색상" })
  @IsString()
  name: string;

  @ApiProperty({ description: "표시 순서", example: 1 })
  @IsInt()
  @Min(0)
  display_order: number;

  @ApiProperty({ description: "옵션 목록", type: [ProductOptionDTOForProductCatalog] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDTOForProductCatalog)
  options: ProductOptionDTOForProductCatalog[];
}
