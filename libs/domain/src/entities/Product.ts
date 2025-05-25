import Brand from "./Brand";
import Seller from "./Seller";

export default class Product {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public short_description: string | null,
    public full_description: string | null,
    public created_at: Date,
    public updated_at: Date,
    public seller: Seller,
    public seller_id: number,
    public brand: Brand,
    public brand_id: number,
    public status: string,
  ) {}
}
