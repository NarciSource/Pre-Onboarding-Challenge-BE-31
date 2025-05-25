import {
  BrandEntity,
  SellerEntity,
  ProductCategoryEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductOptionGroupEntity,
  ProductPriceEntity,
  ProductTagEntity,
  ProductOptionEntity,
  ProductImageEntity,
  TagEntity,
  CategoryEntity,
  ReviewEntity,
} from "@libs/infrastructure/rdb/entities";

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
  products: ProductEntity;
  product_details: ProductDetailEntity;
  product_categories: ProductCategoryEntity;
  product_prices: ProductPriceEntity;
  product_option_groups: ProductOptionGroupEntity;
  product_tags: ProductTagEntity;
  product_options: ProductOptionEntity;
  product_images: ProductImageEntity;
  brands: BrandEntity;
  sellers: SellerEntity;
  reviews: ReviewEntity;
  categories: CategoryEntity;
  tags: TagEntity;
}

export type TableEntity = keyof TableEntityMap;
export type TableEntityType<T extends TableEntity> = TableEntityMap[T];
