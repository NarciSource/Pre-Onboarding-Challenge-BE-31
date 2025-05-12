import { OmitType } from "@nestjs/swagger";

import ProductOptionDTO from "../model/ProductOption.dto";

export default class ProductOptionBodyDTO extends OmitType(ProductOptionDTO, [
  "id",
  "option_group_id",
] as const) {}

export class ProductOptionBodyWithGroupDTO extends OmitType(ProductOptionDTO, ["id"] as const) {}
