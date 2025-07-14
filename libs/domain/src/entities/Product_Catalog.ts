import Brand from "./Brand";
import Category from "./Category";
import Product_Detail from "./Product_Detail";
import Product_Image from "./Product_Image";
import Product_Option_Group from "./Product_Option_Group";
import Product_Price from "./Product_Price";
import Seller from "./Seller";
import Tag from "./Tag";

export default class Product_Catalog {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public short_description: string | null,
    public full_description: string | null,
    public created_at: Date,
    public updated_at: Date,

    public brand: Brand,
    public seller: Seller,
    public detail: Omit<Product_Detail, "id" | "product" | "product_id">,
    public price: Omit<Product_Price, "id" | "product" | "product_id" | "cost_price">,
    public categories: Omit<Category, "description" | "level" | "image_url" | "parent">[],
    public option_groups: Omit<Product_Option_Group, "product" | "product_id">[],
    public images: Omit<Product_Image, "product" | "product_id" | "option">[],
    public tags: Tag[],
    public rating: {
      average: number;
      count: number;
      distribution: {
        "5": number;
        "4": number;
        "3": number;
        "2": number;
        "1": number;
      };
    },
  ) {}
}
