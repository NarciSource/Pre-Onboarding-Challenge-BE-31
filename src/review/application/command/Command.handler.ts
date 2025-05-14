import { Review } from "@review/domain/entities";

export default interface CommandHandler {
  register(product_id: number, review: Pick<Review, "rating" | "title" | "content">);

  edit(review_id: number, review: Pick<Review, "rating" | "title" | "content">);

  remove(id: number);
}
