import { Product_Summary } from "@libs/domain/entities";
import { Mapping } from "@libs/domain/repository";

import { ESField, field_metadata } from "../libs/decorator";

export class ProductSummaryDocument implements Omit<Product_Summary, "created_at"> {
  @ESField({ type: "keyword" })
  id: number;

  @ESField({ type: "text", fields: { keyword: { type: "keyword" } } })
  name: string;

  @ESField({ type: "keyword" })
  slug: string;

  @ESField({ type: "text" })
  short_description: string | null;

  @ESField({ type: "long" })
  base_price: number;

  @ESField({ type: "keyword" })
  sale_price: number | null;

  @ESField({ type: "keyword" })
  currency: string;

  @ESField({
    properties: {
      url: { type: "keyword" },
      alt_text: { type: "text" },
    },
  })
  primary_image: {
    url: string;
    alt_text: string | null;
  } | null;

  brand: {
    id: number;
    name: string;
  };

  seller: {
    id: number;
    name: string;
  };

  @ESField({ type: "keyword" })
  status: string;

  @ESField({ type: "date", format: "epoch_millis" })
  created_at: number;

  @ESField({ type: "integer" })
  stock: number;

  @ESField({ type: "float" })
  rating: number;

  review_count: number;

  @ESField({ type: "integer" })
  categories: number[];

  static get mapping() {
    const fields = field_metadata.get(this.name) || {};

    return {
      properties: fields,
      dynamic: false,
    } as const;
  }
}

export default ProductSummaryDocument.mapping as Mapping;
