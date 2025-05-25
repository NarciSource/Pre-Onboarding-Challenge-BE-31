import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiErrorResponse, ApiStandardResponse, ResponseType } from "libs/decorators";
import { FindQuery } from "browsing/application/query";
import { MainResponseBundleDTO, ResponseDTO } from "../dto";

@ApiTags("메인")
@Controller("main")
@ApiErrorResponse()
export default class MainController {
  constructor(private readonly query_bus: QueryBus) {}

  @ApiOperation({ summary: "메인 페이지용 상품 목록" })
  @ApiStandardResponse("메인 페이지 상품 목록을 성공적으로 조회했습니다.", MainResponseBundleDTO)
  @Get()
  @ResponseType(ResponseDTO<MainResponseBundleDTO>)
  async read_main_products() {
    const query = new FindQuery();

    const data: MainResponseBundleDTO = await this.query_bus.execute(query);

    return {
      success: true,
      data,
      message: "메인 페이지 상품 목록을 성공적으로 조회했습니다.",
    };
  }
}
