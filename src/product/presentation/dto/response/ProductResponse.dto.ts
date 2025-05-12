import { PickType } from "@nestjs/swagger";

import ProductDTO from "../model/Product.dto";

export default class ProductResponseDTO extends PickType(ProductDTO, [
  "id",
  "name",
  "slug",
  "created_at",
  "updated_at",
] as const) {}
