import { ApiProperty, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

import ProductDTO from "@product/presentation/dto/model/Product.dto";
import CategoryDTO from "@category/presentation/dto/Category.dto";
import ReviewSummaryDTO from "@review/presentation/dto/ReviewSummary.dto";

class CategoryDTOForProductCatalog extends PickType(CategoryDTO, [
  "id",
  "name",
  "slug",
  "is_primary",
  "parent",
] as const) {}

export default class ProductCatalogDTO extends ProductDTO {
  @ApiProperty({ description: "카테고리 목록", type: [CategoryDTOForProductCatalog] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDTOForProductCatalog)
  categories: CategoryDTOForProductCatalog[];

  @ApiProperty({ description: "평점 요약", type: ReviewSummaryDTO })
  @ValidateNested()
  @Type(() => ReviewSummaryDTO)
  rating: ReviewSummaryDTO;
}
