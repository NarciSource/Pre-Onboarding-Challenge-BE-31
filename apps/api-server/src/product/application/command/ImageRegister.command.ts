import { Product_Image } from "@libs/domain/entities";

export default class ImageRegisterCommand {
  constructor(
    public readonly product_id: number,
    public readonly option_id: number | null,
    public readonly image: Omit<Product_Image, "id" | "product" | "option">,
  ) {}
}
