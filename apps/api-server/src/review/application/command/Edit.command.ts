import { Review } from "@libs/domain/entities";

export default class EditCommand {
  constructor(
    public readonly id: number,
    public readonly dto: Pick<Review, "rating" | "title" | "content">,
  ) {}
}
