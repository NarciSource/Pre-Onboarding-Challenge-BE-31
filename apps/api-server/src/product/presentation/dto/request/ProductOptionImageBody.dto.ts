import { OmitType } from "@nestjs/swagger";

import ImageDTO from "../model/Image.dto";

export default class ProductOptionImageBodyDTO extends OmitType(ImageDTO, ["id"] as const) {}
