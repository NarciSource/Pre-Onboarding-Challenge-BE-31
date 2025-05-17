import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

import BrandModel from "./Brand.model";
import CategoryModel from "./Category.model";
import ProductDetailModel from "./Detail.model";
import ImageModel from "./Image.model";
import OptionGroupModel from "./OptionGroup.model";
import PriceModel from "./Price.model";
import RatingModel from "./Rating.model";
import SellerModel from "./Seller.model";
import TagModel from "./Tag.model";

@Schema()
export default class ProductCatalogModel extends Document {
  @Prop({ unique: true })
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: String })
  short_description: string | null;

  @Prop({ type: String })
  full_description: string | null;

  @Prop()
  status: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop({ type: BrandModel })
  brand: BrandModel;

  @Prop({ type: SellerModel })
  seller: SellerModel;

  @Prop({ type: ProductDetailModel })
  detail: ProductDetailModel;

  @Prop({ type: PriceModel })
  price: PriceModel;

  @Prop({ type: [CategoryModel] })
  categories: CategoryModel[];

  @Prop({ type: [OptionGroupModel] })
  option_groups: OptionGroupModel[];

  @Prop({ type: [ImageModel] })
  images: ImageModel[];

  @Prop({ type: [TagModel] })
  tags: TagModel[];

  @Prop({ type: RatingModel })
  rating: RatingModel;
}
