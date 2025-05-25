import { Product_Option } from "product/domain/entities";

export default class OptionEditCommand {
  constructor(
    public readonly product_id: number,
    public readonly option_id: number,
    public readonly options: Omit<Product_Option, "id" | "option_group_id">,
  ) {}
}
