import { Prop } from "@nestjs/mongoose";

export class DimensionsModel {
  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  depth: number;
}

export class AdditionalInfoModel {
  @Prop()
  assembly_required: boolean;

  @Prop()
  assembly_time: string;
}

export default class ProductDetailModel {
  @Prop({ type: Number })
  weight: number | null;

  @Prop({ type: DimensionsModel })
  dimensions: DimensionsModel | null;

  @Prop({ type: String })
  materials: string | null;

  @Prop({ type: String })
  country_of_origin: string | null;

  @Prop({ type: String })
  warranty_info: string | null;

  @Prop({ type: String })
  care_instructions: string | null;

  @Prop({ type: AdditionalInfoModel })
  additional_info: AdditionalInfoModel | null;
}
