export default class Product_Option {
  constructor(
    public id: number,
    public name: string,
    public additional_price: number,
    public sku: string | null,
    public stock: number,
    public display_order: number,
  ) {}
}
