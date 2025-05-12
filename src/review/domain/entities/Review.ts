import { Product } from "@product/domain/entities";
import User from "./User";

export default class Review {
  constructor(
    public id: number,
    public product: Product,
    public user: User | null,
    public rating: number,
    public title: string | null,
    public content: string | null,
    public created_at: Date,
    public updated_at: Date,
    public verified_purchase: boolean,
    public helpful_votes: number,
  ) {}
}
