import { Prop } from "@nestjs/mongoose";

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

export default class RatingModel {
  @Prop()
  average: number;

  @Prop()
  count: number;

  @Prop({ type: RatingDistributionModel })
  distribution: RatingDistributionModel;
}
