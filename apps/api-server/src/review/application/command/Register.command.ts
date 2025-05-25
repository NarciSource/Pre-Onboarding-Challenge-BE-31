import { Review } from "@libs/domain/entities";

export default class RegisterCommand {
  constructor(
    public readonly product_id: number,
    public readonly dto: Pick<Review, "rating" | "title" | "content">,
  ) {}
}
