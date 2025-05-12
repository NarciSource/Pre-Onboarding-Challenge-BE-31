import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl } from "class-validator";

export default class BrandDTO {
  @ApiPropertyOptional({ description: "브랜드 ID", example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: "브랜드 이름", example: "편안가구" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "브랜드 설명",
    example: "편안함을 추구하는 가구 브랜드",
    nullable: true,
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    description: "브랜드 로고 URL",
    example: "https://example.com/brands/comfortfurniture.png",
    nullable: true,
  })
  @IsUrl()
  logo_url: string | null;

  @ApiProperty({
    description: "브랜드 웹사이트",
    example: "https://comfortfurniture.com",
    nullable: true,
  })
  @IsUrl()
  website: string | null;
}
