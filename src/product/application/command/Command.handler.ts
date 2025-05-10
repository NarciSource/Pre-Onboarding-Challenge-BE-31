import ProductInputDTO from "./ProductInput.dto";

export default interface CommandHandler {
  register(dto: ProductInputDTO);

  edit(product_id: number, dto: ProductInputDTO);

  remove(product_id: number);
}
