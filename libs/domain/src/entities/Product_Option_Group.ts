import Product from "./Product";

export default class Product_Option_Group {
  constructor(
    public id: number,
    public name: string,
    public product: Product,
    public product_id: number,
    public display_order: number,
  ) {}
}
