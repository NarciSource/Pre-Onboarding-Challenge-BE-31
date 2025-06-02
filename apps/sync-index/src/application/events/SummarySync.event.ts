import { ProductSummaryDocs } from "../../infrastructure";

export default class SummarySyncEvent {
  constructor(
    public collection: string,
    public docs: ProductSummaryDocs,
  ) {}
}
