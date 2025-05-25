import Category from "./Category";
import Product from "./Product";

export default class Product_Category {
  constructor(
    public id: number,
    public product: Product,
    public product_id: number,
    public category: Category,
    public category_id: number,
    public is_primary: boolean,
  ) {}
}
