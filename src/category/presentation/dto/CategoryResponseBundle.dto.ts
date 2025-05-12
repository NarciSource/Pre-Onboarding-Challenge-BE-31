import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";

import { PaginationSummaryDTO } from "@shared/dto";
import ProductSummaryDTO from "@browsing/presentation/dto/ProductSummary.dto";
import CategoryDTO from "./Category.dto";

export class CategoryResponseDTO extends OmitType(CategoryDTO, ["is_primary"] as const) {}

export default class CategoryResponseBundleDTO {
  @ApiProperty({ description: "카테고리 정보", type: CategoryResponseDTO })
  @IsDefined()
  @ValidateNested()
  @Type(() => CategoryResponseDTO)
  category: CategoryResponseDTO;

  @ApiProperty({ description: "상품 요약 목록", type: [ProductSummaryDTO] })
  @IsArray()
  @ValidateNested()
  @Type(() => ProductSummaryDTO)
  items: ProductSummaryDTO[];

  @ApiProperty({ description: "페이지네이션 정보", type: PaginationSummaryDTO })
  @IsDefined()
  @ValidateNested()
  @Type(() => PaginationSummaryDTO)
  pagination: PaginationSummaryDTO;
}
