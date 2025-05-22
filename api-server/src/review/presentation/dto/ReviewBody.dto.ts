import { PickType } from "@nestjs/swagger";

import ReviewDTO from "./Review.dto";

export default class ReviewBodyDTO extends PickType(ReviewDTO, [
  "rating",
  "title",
  "content",
] as const) {}
