import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiErrorResponse,
  ApiStandardResponse,
  ResponseType,
} from "libs/decorators";
import {
  ImageRegisterCommand,
  OptionEditCommand,
  OptionRegisterCommand,
  OptionRemoveCommand,
} from "product/application/command";
import {
  ImageDTO,
  OptionParamDTO,
  ParamDTO,
  ProductOptionBodyDTO,
  ProductOptionBodyWithGroupDTO,
  ProductOptionDTO,
  ProductOptionImageBodyDTO,
  ResponseDTO,
} from "../dto";

@ApiTags("상품 옵션 관리")
@ApiBearerAuth()
@Controller("products")
@ApiErrorResponse()
export default class ProductOptionsController {
  constructor(private readonly command_bus: CommandBus) {}

  @ApiOperation({ summary: "상품 옵션 추가" })
  @ApiParam({ name: "id", description: "상품 ID" })
  @ApiCreatedResponse("상품 옵션이 성공적으로 추가되었습니다.", ProductOptionDTO)
  @ApiBadRequestResponse("상품 옵션 추가에 실패했습니다.")
  @Post(":id/options")
  @ResponseType(ResponseDTO<ProductOptionDTO>)
  async create_option(
    @Param() { id }: ParamDTO,
    @Body() { option_group_id, ...body }: ProductOptionBodyWithGroupDTO,
  ) {
    const command = new OptionRegisterCommand(id, option_group_id, body);

    const data: ProductOptionDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "상품 옵션이 성공적으로 추가되었습니다.",
    };
  }

  @ApiOperation({ summary: "상품 옵션 수정" })
  @ApiParam({ name: "id", description: "상품 ID" })
  @ApiParam({ name: "optionId", description: "옵션 ID" })
  @ApiStandardResponse("상품 옵션이 성공적으로 수정되었습니다.", ProductOptionDTO)
  @ApiBadRequestResponse("상품 옵션 수정에 실패했습니다.")
  @Put(":id/options/:optionId")
  @ResponseType(ResponseDTO<ProductOptionDTO>)
  async update_option(
    @Param() { id, optionId }: OptionParamDTO,
    @Body() body: ProductOptionBodyDTO,
  ) {
    const command = new OptionEditCommand(id, optionId, body);

    const data: ProductOptionDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "상품 옵션이 성공적으로 수정되었습니다.",
    };
  }

  @ApiOperation({ summary: "상품 옵션 삭제" })
  @ApiParam({ name: "id", description: "상품 ID" })
  @ApiParam({ name: "optionId", description: "옵션 ID" })
  @ApiStandardResponse("상품 옵션이 성공적으로 삭제되었습니다.")
  @ApiBadRequestResponse("상품 옵션 삭제에 실패했습니다.")
  @Delete(":id/options/:optionId")
  async delete_option(@Param() { id, optionId }: OptionParamDTO) {
    const command = new OptionRemoveCommand(id, optionId);

    await this.command_bus.execute(command);

    return {
      success: true,
      data: null,
      message: "상품 옵션이 성공적으로 삭제되었습니다.",
    };
  }

  @ApiOperation({ summary: "상품 이미지 추가" })
  @ApiParam({ name: "id", description: "상품 ID" })
  @ApiCreatedResponse("상품 이미지가 성공적으로 추가되었습니다.", ImageDTO)
  @ApiBadRequestResponse("상품 이미지 추가에 실패했습니다.")
  @Post(":id/images")
  @ResponseType(ResponseDTO<ImageDTO>)
  async create_image(
    @Param() { id }: OptionParamDTO,
    @Body() { option_id, ...body }: ProductOptionImageBodyDTO,
  ) {
    const command = new ImageRegisterCommand(id, option_id, body);

    const data: ImageDTO = await this.command_bus.execute(command);

    return {
      success: true,
      data,
      message: "상품 이미지가 성공적으로 추가되었습니다.",
    };
  }
}
