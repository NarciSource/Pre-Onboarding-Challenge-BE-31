import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Controller, Get, Inject } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiErrorResponse, ApiStandardResponse, ResponseType } from "libs/decorators";
import { FindQuery } from "browsing/application/query";
import { MainResponseBundleDTO, ResponseDTO } from "../dto";

@ApiTags("메인")
@Controller("main")
@ApiErrorResponse()
export default class MainController {
  constructor(
    private readonly query_bus: QueryBus,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @ApiOperation({ summary: "메인 페이지용 상품 목록" })
  @ApiStandardResponse("메인 페이지 상품 목록을 성공적으로 조회했습니다.", MainResponseBundleDTO)
  @Get()
  @ResponseType(ResponseDTO<MainResponseBundleDTO>)
  async read_main_products() {
    const key = "main-products";
    const cached: ResponseDTO<MainResponseBundleDTO> | undefined = await this.cache.get(key);

    if (cached) {
      return cached;
    }

    const query = new FindQuery();

    const data: MainResponseBundleDTO = await this.query_bus.execute(query);

    const result = {
      success: true,
      data,
      message: "메인 페이지 상품 목록을 성공적으로 조회했습니다.",
    };

    await this.cache.set(key, result, 60 * 1000);

    return result;
  }
}
