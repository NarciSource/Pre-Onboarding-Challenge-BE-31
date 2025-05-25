import Product_Option_Group from "./Product_Option_Group";

export default class Product_Option {
  constructor(
    public id: number,
    public option_group: Product_Option_Group,
    public option_group_id: number,
    public name: string,
    public additional_price: number,
    public sku: string | null,
    public stock: number,
    public display_order: number,
  ) {}
}
