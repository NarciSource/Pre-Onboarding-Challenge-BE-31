import Product from "./Product";
import Product_Option from "./Product_Option";

export default class Product_Image {
  constructor(
    public id: number,
    public product: Product,
    public product_id: number,
    public url: string,
    public alt_text: string | null,
    public is_primary: boolean,
    public display_order: number,
    public option: Product_Option | null,
    public option_id: number | null,
  ) {}
}
