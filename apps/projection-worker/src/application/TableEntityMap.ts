import {
  Brand,
  Category,
  Product,
  Product_Category,
  Product_Detail,
  Product_Image,
  Product_Option,
  Product_Option_Group,
  Product_Price,
  Product_Tag,
  Review,
  Seller,
  Tag,
} from "@libs/domain/entities";

export enum DebeziumOperation {
  CREATE = "c",
  UPDATE = "u",
  DELETE = "d",
  READ = "r",
}

export interface DebeziumMessage<T> {
  before: T | null;
  after: T | null;
  op: DebeziumOperation;
  source: {
    version: string;
    connector: string;
    name: string;
    ts_ms: number;
    snapshot?: string;
    db: string;
    sequence?: string;
    schema: string;
    table: TableEntity;
    txId?: number;
    lsn?: number;
    xmin?: number | null;
  };
  ts_ms: number;
  ts_us?: number;
  ts_ns?: number;
}

export default interface TableEntityMap {
  products: Product;
  product_details: Product_Detail;
  product_categories: Product_Category;
  product_prices: Product_Price;
  product_option_groups: Product_Option_Group;
  product_tags: Product_Tag;
  product_options: Product_Option;
  product_images: Product_Image;
  brands: Brand;
  sellers: Seller;
  reviews: Review;
  categories: Category;
  tags: Tag;
}

export type TableEntity = keyof TableEntityMap;
export type TableEntityType<T extends TableEntity> = TableEntityMap[T];
