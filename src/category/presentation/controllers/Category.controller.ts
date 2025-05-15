import { Controller, Get, Param, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import {
  ApiBadRequestResponse,
  ApiErrorResponse,
  ApiStandardResponse,
  ResponseType,
} from "@libs/decorators";
import { to_FilterDTO } from "@shared/mappers";
import { FindAllQuery, FindProductsQuery } from "@category/application/query";
import {
  CategoryQueryDTO,
  CategoryResponseBundleDTO,
  NestedCategoryDTO,
  ParamDTO,
  ResponseDTO,
} from "../dto";

@ApiTags("카테고리")
@ApiBearerAuth()
@Controller("categories")
@ApiErrorResponse()
export default class CategoryController {
  constructor(private readonly query_bus: QueryBus) {}

  @ApiOperation({ summary: "카테고리 목록 조회" })
  @ApiStandardResponse("카테고리 목록을 성공적으로 조회했습니다.", NestedCategoryDTO)
  @ApiBadRequestResponse("카테고리 목록 조회에 실패했습니다.")
  @Get()
  @ResponseType(ResponseDTO<NestedCategoryDTO[]>)
  async read_categories(@Query() { level }: { level: number }) {
    const query = new FindAllQuery(level);

    const data: NestedCategoryDTO[] = await this.query_bus.execute(query);

    return {
      success: true,
      data,
      message: "카테고리 목록을 성공적으로 조회했습니다.",
    };
  }

  @ApiOperation({ summary: "특정 카테고리의 상품 목록 조회" })
  @ApiStandardResponse(
    "특정 카테고리의 상품 목록을 성공적으로 조회했습니다.",
    CategoryResponseBundleDTO,
  )
  @ApiBadRequestResponse("특정 카테고리의 상품 목록 조회에 실패했습니다.")
  @Get(":id/products")
  @ResponseType(ResponseDTO<CategoryResponseBundleDTO>)
  async read_products(@Param() { id }: ParamDTO, @Query() query_dto: CategoryQueryDTO) {
    const query = new FindProductsQuery(id, to_FilterDTO(query_dto));

    const data: CategoryResponseBundleDTO = await this.query_bus.execute(query);

    return {
      success: true,
      data,
      message: "카테고리 상품 목록을 성공적으로 조회했습니다.",
    };
  }
}
