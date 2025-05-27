import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

import { TransformToBoolean } from "libs/decorators/Transform";

export default class ResponseDTO<T> {
  @ApiProperty({ description: "요청 성공 여부", example: true })
  @TransformToBoolean()
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: "응답 데이터", example: {} })
  @ValidateNested()
  data: T;

  @ApiPropertyOptional({
    description: "응답 메시지",
    example: "요청이 성공적으로 처리되었습니다.",
    required: false,
  })
  @IsOptional()
  message?: string;
}
