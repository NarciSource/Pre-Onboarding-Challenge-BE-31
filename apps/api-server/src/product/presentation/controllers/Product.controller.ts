import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiErrorResponse,
  ApiStandardResponse,
  ResponseType,
} from "libs/decorators";
import { to_FilterDTO } from "shared/mappers";
import { EditCommand, RegisterCommand, RemoveCommand } from "product/application/command";
import { FindAllQuery, FindQuery } from "product/application/query";
import { ProductCatalogDTO } from "browsing/presentation/dto";
import {
  ParamDTO,
  ProductBodyDTO,
  ProductQueryDTO,
  ProductResponseBundle,
  ProductResponseDTO,
  ResponseDTO,
} from "../dto";

@ApiTags("상품 관리")
@ApiBearerAuth()
@Controller("products")
@ApiErrorResponse()
export default class ProductController {
  constructor(
    private readonly query_bus: QueryBus,
    private readonly command_bus: CommandBus,
  ) {}

  @ApiOperation({ summary: "상품 등록" })
  @ApiCreatedResponse("상품이 성공적으로 등록되었습니다.", ProductResponseDTO)
  @ApiBadRequestResponse("상품 등록에 실패했습니다.")
  @Post()
  @ResponseType(ResponseDTO<ProductResponseDTO>)
  async create(@Body() body: ProductBodyDTO) {
    // 상품 등록 커맨드
    const command = new RegisterCommand(body);
    // 커맨드 버스로 실행
    const data: ProductResponseDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "상품이 성공적으로 등록되었습니다.",
    };
  }

  @ApiOperation({ summary: "상품 목록 조회" })
  @ApiStandardResponse("상품 목록을 성공적으로 조회했습니다.", ProductResponseBundle)
  @ApiBadRequestResponse("상품 목록 조회에 실패했습니다.")
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60 * 1000)
  @ResponseType(ResponseDTO<ProductResponseBundle>)
  async read_all(@Query() query_dto: ProductQueryDTO) {
    // 상품 목록 조회 쿼리
    const query = new FindAllQuery(to_FilterDTO(query_dto));
    // 쿼리 버스로 실행
    const data: ProductResponseBundle = await this.query_bus.execute(query);

    return {
      success: true,
      data,
      message: "상품 목록을 성공적으로 조회했습니다.",
    };
  }

  @ApiOperation({ summary: "상품 상세 조회" })
  @ApiStandardResponse("상품 상세 정보를 성공적으로 조회했습니다.", ProductCatalogDTO)
  @ApiBadRequestResponse("요청한 상품을 찾을 수 없습니다.")
  @Get(":id")
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10 * 60 * 1000)
  @ResponseType(ResponseDTO<ProductCatalogDTO>)
  async read(@Param() { id }: ParamDTO) {
    const query = new FindQuery(id);

    const data: ProductCatalogDTO = await this.query_bus.execute(query);

    return {
      success: true,
      data,
      message: "상품 상세 정보를 성공적으로 조회했습니다.",
    };
  }

  @ApiOperation({ summary: "상품 수정" })
  @ApiStandardResponse("상품이 성공적으로 수정되었습니다.", ProductResponseDTO)
  @ApiBadRequestResponse("상품 수정에 실패했습니다.")
  @Put(":id")
  @ResponseType(ResponseDTO<ProductResponseDTO>)
  async update(@Param() { id }: ParamDTO, @Body() body: ProductBodyDTO) {
    const command = new EditCommand(id, body);

    const data: ProductResponseDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "상품이 성공적으로 수정되었습니다.",
    };
  }

  @ApiOperation({ summary: "상품 삭제" })
  @ApiStandardResponse("상품이 성공적으로 삭제되었습니다.")
  @ApiBadRequestResponse("상품 삭제에 실패했습니다.")
  @Delete(":id")
  async delete(@Param() { id }: ParamDTO) {
    const command = new RemoveCommand(id);

    await this.command_bus.execute(command);

    return {
      success: true,
      data: null,
      message: "상품이 성공적으로 삭제되었습니다.",
    };
  }
}
