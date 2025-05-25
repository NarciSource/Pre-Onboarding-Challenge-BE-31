import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNumber, Max, Min } from "class-validator";

export default class ReviewSummaryDTO {
  @ApiProperty({ description: "리뷰 평균 평점", example: 4.5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  average: number;

  @ApiProperty({ description: "리뷰 개수", example: 100 })
  @IsInt()
  @Min(0)
  count: number;

  @ApiProperty({
    description: "리뷰 평점 분포",
    example: {
      1: 10,
      2: 20,
      3: 30,
      4: 25,
      5: 15,
    },
  })
  @IsDefined()
  @IsInt({ each: true })
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
