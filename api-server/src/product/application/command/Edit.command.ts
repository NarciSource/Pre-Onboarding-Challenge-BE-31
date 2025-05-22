import {
  Product,
  Product_Detail,
  Product_Image,
  Product_Option,
  Product_Option_Group,
  Product_Price,
} from "@product/domain/entities";

export default class EditCommand {
  constructor(
    public readonly id: number,
    public readonly dto: {
      detail: Omit<Product_Detail, "id" | "product">;
      price: Omit<Product_Price, "id" | "product">;
      categories: { category_id: number; is_primary: boolean }[];
      option_groups: (Omit<Product_Option_Group, "id" | "product"> & {
        options: Omit<Product_Option, "id" | "option_group_id">[];
      })[];
      images: Omit<Product_Image & { option_id: number | null }, "id" | "product" | "option">[];
      tags: number[];
      seller_id: number;
      brand_id: number;
    } & Omit<Product, "id" | "created_at" | "updated_at" | "seller" | "brand">,
  ) {}
}
