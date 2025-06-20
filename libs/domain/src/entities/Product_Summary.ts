export default class Product_Summary {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public short_description: string | null,
    public base_price: number,
    public sale_price: number | null,
    public currency: string,
    public primary_image: {
      url: string;
      alt_text: string | null;
    } | null,
    public brand: {
      id: number;
      name: string;
    },
    public seller: {
      id: number;
      name: string;
    },
    public status: string,
    public created_at: Date,
    public stock: number,
    public rating: number,
    public review_count: number,
    public categories: number[],
  ) {}
}
