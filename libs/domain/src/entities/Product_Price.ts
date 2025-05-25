import Product from "./Product";

export default class Product_Price {
  constructor(
    public id: number,
    public product: Product,
    public product_id: number,
    public base_price: number,
    public sale_price: number | null,
    public cost_price: number | null,
    public currency: string,
    public tax_rate: number | null,
  ) {}
}
