import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, Matches, Max, Min } from "class-validator";

export default class ProductPriceDTO {
  @ApiProperty({ description: "기본 가격", example: 599000 })
  @IsInt()
  @Min(0)
  base_price: number;

  @ApiProperty({ description: "할인 가격", example: 499000, nullable: true })
  @IsInt()
  @Min(0)
  sale_price: number | null;

  @ApiProperty({ description: "원가", example: 350000, nullable: true })
  @IsInt()
  @Min(0)
  cost_price: number | null;

  @ApiProperty({ description: "통화", example: "KRW" })
  @Matches(/^[A-Z]{3}$/, { message: "통화 코드는 3자리 대문자여야 합니다 (예: USD, KRW)" })
  currency: string;

  @ApiProperty({ description: "세율", example: 10, nullable: true })
  @IsNumber()
  @Min(0)
  tax_rate: number | null;

  @ApiProperty({ description: "할인율", example: 17, nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount_percentage: number | null;
}
