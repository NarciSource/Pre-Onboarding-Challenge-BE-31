import { Product_Option, Product_Image } from "@product/domain/entities";
import ProductInputDTO from "./ProductInput.dto";

export default interface CommandHandler {
  register(dto: ProductInputDTO);

  edit(product_id: number, dto: ProductInputDTO);

  remove(product_id: number);
}

export interface OptionsCommandHandler {
  register(
    product_id: number,
    option_group_id: number,
    option: Omit<Product_Option, "id" | "option_group_id">,
  );

  edit(
    product_id: number,
    option_id: number,
    options: Omit<Product_Option, "id" | "option_group_id">,
  );

  remove(product_id: number, option_id: number);

  register_images(
    product_id: number,
    option_id: number | null,
    image: Omit<Product_Image, "id" | "product" | "option">,
  );
}
