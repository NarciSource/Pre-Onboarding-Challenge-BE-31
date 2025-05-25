import Product from "./Product";
import Tag from "./Tag";

export default class Product_Tag {
  constructor(
    public id: number,
    public product: Product,
    public product_id: number,
    public tag: Tag,
    public tag_id: number,
  ) {}
}
