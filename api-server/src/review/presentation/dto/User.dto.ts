import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl } from "class-validator";

export default class UserDTO {
  @ApiProperty({ description: "사용자 ID", example: 250 })
  @IsInt()
  id: number;

  @ApiProperty({ description: "사용자 이름", example: "홍길동" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "사용자 아바타 URL",
    example: "https://example.com/avatars/user250.jpg",
    nullable: true,
  })
  @IsUrl()
  avatar_url: string | null;
}
