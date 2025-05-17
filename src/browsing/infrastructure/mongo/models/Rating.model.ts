import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
class RatingDistributionModel {
  @Prop()
  "5": number;

  @Prop()
  "4": number;

  @Prop()
  "3": number;

  @Prop()
  "2": number;

  @Prop()
  "1": number;
}

@Schema({ _id: false })
export default class RatingModel {
  @Prop()
  average: number;

  @Prop()
  count: number;

  @Prop({ type: RatingDistributionModel })
  distribution: RatingDistributionModel;
}
