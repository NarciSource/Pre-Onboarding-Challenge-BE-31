import { ProductSummaryModel } from "@libs/infrastructure/mongo/models";

type ProductSummaryDocs = Omit<ProductSummaryModel, "created_at"> & {
  _id: string;
  __v: string;
  created_at: number;
};

export default ProductSummaryDocs;
