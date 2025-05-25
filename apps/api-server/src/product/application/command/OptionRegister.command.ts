import { Product_Option } from "@libs/domain/entities";

export default class OptionRegisterCommand {
  constructor(
    public readonly product_id: number,
    public readonly option_group_id: number,
    public readonly options: Omit<Product_Option, "id" | "option_group_id">,
  ) {}
}
