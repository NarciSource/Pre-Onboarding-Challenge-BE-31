import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiErrorResponse,
  ApiForbiddenResponse,
  ApiStandardResponse,
  ResponseType,
} from "libs/decorators";
import { to_FilterDTO } from "shared/mappers";
import { EditCommand, RegisterCommand, RemoveCommand } from "review/application/command";
import { FindQuery } from "review/application/query";
import {
  ReviewResponseBundle,
  ResponseDTO,
  ParamDTO,
  ReviewQueryDTO,
  ReviewDTO,
  ReviewBodyDTO,
  ReviewResponseDTO,
} from "../dto";

@ApiTags("리뷰")
@ApiBearerAuth()
@Controller("")
@ApiErrorResponse()
export default class ReviewController {
  constructor(
    private readonly query_bus: QueryBus,
    private readonly command_bus: CommandBus,
  ) {}

  @ApiOperation({ summary: "상품 리뷰 조회" })
  @ApiStandardResponse("상품 리뷰를 성공적으로 조회했습니다.", ReviewResponseBundle)
  @ApiBadRequestResponse("상품 리뷰 조회에 실패했습니다.")
  @Get("products/:id/reviews")
  @ResponseType(ResponseDTO<ReviewResponseBundle>)
  async read(
    @Param() { id: product_id }: ParamDTO,
    @Query() query_dto: ReviewQueryDTO,
  ): Promise<ResponseDTO<ReviewResponseBundle>> {
    const query = new FindQuery(product_id, to_FilterDTO(query_dto));

    const data: ReviewResponseBundle = await this.query_bus.execute(query);

    return {
      success: true,
      data,
      message: "상품 리뷰를 성공적으로 조회했습니다.",
    };
  }

  @ApiOperation({ summary: "리뷰 작성" })
  @ApiCreatedResponse("리뷰가 성공적으로 작성되었습니다.", ReviewDTO)
  @ApiBadRequestResponse("리뷰 작성에 실패했습니다.")
  @Post("products/:id/reviews")
  @ResponseType(ResponseDTO<ReviewDTO>)
  async create(
    @Param() { id: product_id }: ParamDTO,
    @Body() body: ReviewBodyDTO,
  ): Promise<ResponseDTO<ReviewDTO>> {
    const command = new RegisterCommand(product_id, body);

    const data: ReviewDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "리뷰가 성공적으로 작성되었습니다.",
    };
  }

  @ApiOperation({ summary: "리뷰 수정" })
  @ApiStandardResponse("리뷰가 성공적으로 수정되었습니다.", ReviewResponseDTO)
  @ApiForbiddenResponse("다른 사용자의 리뷰를 수정할 권한이 없습니다.")
  @Put("reviews/:id")
  @ResponseType(ResponseDTO<ReviewResponseDTO>)
  async update(
    @Param() { id }: ParamDTO,
    @Body() body: ReviewBodyDTO,
  ): Promise<ResponseDTO<ReviewResponseDTO>> {
    const command = new EditCommand(id, body);

    const data: ReviewResponseDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "리뷰가 성공적으로 수정되었습니다.",
    };
  }

  @ApiOperation({ summary: "리뷰 삭제" })
  @ApiStandardResponse("리뷰가 성공적으로 삭제되었습니다.")
  @ApiForbiddenResponse("다른 사용자의 리뷰를 삭제할 권한이 없습니다.")
  @Delete("reviews/:id")
  async delete(@Param() { id }: ParamDTO) {
    const command = new RemoveCommand(id);

    await this.command_bus.execute(command);

    return {
      success: true,
      data: null,
      message: "리뷰가 성공적으로 삭제되었습니다.",
    };
  }
}
