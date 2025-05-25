import {
  Product,
  Product_Detail,
  Product_Image,
  Product_Option,
  Product_Option_Group,
  Product_Price,
} from "@libs/domain/entities";

export default class RegisterCommand {
  constructor(
    public readonly dto: {
      detail: Omit<Product_Detail, "id" | "product" | "product_id">;
      price: Omit<Product_Price, "id" | "product" | "product_id">;
      categories: { category_id: number; is_primary: boolean }[];
      option_groups: (Omit<Product_Option_Group, "id" | "product" | "product_id"> & {
        options: Omit<Product_Option, "id" | "option_group" | "option_group_id">[];
      })[];
      images: Omit<
        Product_Image & { option_id: number | null },
        "id" | "product" | "product_id" | "option"
      >[];
      tags: number[];
      seller_id: number;
      brand_id: number;
    } & Omit<Product, "id" | "created_at" | "updated_at" | "seller" | "brand">,
  ) {}
}
