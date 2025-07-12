import { Prop, Schema } from "@nestjs/mongoose";

import BrandModel from "./sub/Brand.model";
import CategoryModel from "./sub/Category.model";
import ProductDetailModel from "./sub/Detail.model";
import ImageModel from "./sub/Image.model";
import OptionGroupModel from "./sub/OptionGroup.model";
import PriceModel from "./sub/Price.model";
import RatingModel from "./sub/Rating.model";
import SellerModel from "./sub/Seller.model";
import TagModel from "./sub/Tag.model";

class ExtendedCategoryModel extends CategoryModel {
  @Prop()
  is_primary: boolean;

  @Prop({ type: CategoryModel })
  parent?: CategoryModel | null;
}

@Schema()
export default class ProductCatalogModel {
  @Prop({ unique: true })
  _id: string;
  id: number;

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

  @Prop({ type: [ExtendedCategoryModel] })
  categories: ExtendedCategoryModel[];

  @Prop({ type: [OptionGroupModel] })
  option_groups: OptionGroupModel[];

  @Prop({ type: [ImageModel] })
  images: ImageModel[];

  @Prop({ type: [TagModel] })
  tags: TagModel[];

  @Prop({ type: RatingModel })
  rating: RatingModel;
}
