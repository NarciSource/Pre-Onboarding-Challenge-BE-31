import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from "class-validator";

import { TransformToBoolean } from "libs/decorators/Transform";

export class DimensionsDTO {
  @ApiProperty({ description: "가로 길이", example: 200 })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ description: "세로 길이", example: 85 })
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty({ description: "깊이", example: 90 })
  @IsNumber()
  @Min(0)
  depth: number;
}

export class AdditionalInfoDTO {
  @ApiProperty({ description: "조립 필요 여부", example: true })
  @TransformToBoolean()
  @IsBoolean()
  assembly_required: boolean;

  @ApiProperty({ description: "조립 시간", example: "30분" })
  @Matches(/^(\d+시간)?(\d+분)?(\d+초)?$/, {
    message: "조립 시간 형식은 'X시간 Y분 Z초'이어야 합니다.",
  })
  assembly_time: string;
}

export default class ProductDetailDTO {
  @ApiProperty({ description: "무게", example: 25.5, nullable: true })
  @IsNumber()
  @Min(0)
  weight: number | null;

  @ApiProperty({ description: "크기 정보", type: DimensionsDTO, nullable: true })
  @IsDefined()
  @ValidateNested()
  @Type(() => DimensionsDTO)
  dimensions: DimensionsDTO | null;

  @ApiProperty({ description: "재료", example: "가죽, 목재, 폼", nullable: true })
  @IsString()
  materials: string | null;

  @ApiProperty({ description: "원산지", example: "대한민국", nullable: true })
  @IsString()
  country_of_origin: string | null;

  @ApiProperty({ description: "보증 정보", example: "2년 품질 보증", nullable: true })
  @IsString()
  warranty_info: string | null;

  @ApiProperty({
    description: "관리 지침",
    example: "마른 천으로 표면을 닦아주세요",
    nullable: true,
  })
  @IsString()
  care_instructions: string | null;

  @ApiProperty({ description: "추가 정보", type: AdditionalInfoDTO, nullable: true })
  @IsDefined()
  @ValidateNested()
  @Type(() => AdditionalInfoDTO)
  additional_info: AdditionalInfoDTO | null;
}
