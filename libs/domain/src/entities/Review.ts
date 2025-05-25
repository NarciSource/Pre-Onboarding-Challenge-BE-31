import Product from "./Product";
import User from "./User";

export default class Review {
  constructor(
    public id: number,
    public product: Product,
    public product_id: number,
    public user: User | null,
    public rating: 1 | 2 | 3 | 4 | 5,
    public title: string | null,
    public content: string | null,
    public created_at: Date,
    public updated_at: Date,
    public verified_purchase: boolean,
    public helpful_votes: number,
  ) {}
}
