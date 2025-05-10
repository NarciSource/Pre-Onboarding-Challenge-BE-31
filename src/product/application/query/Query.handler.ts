import { FilterDTO } from "@shared/dto";
import ProductCatalogDTO from "./ProductCatalog.dto";
import ProductSummaryDTO from "./ProductSummary.dto";

export default interface QueryHandler {
  find_all(dto: FilterDTO): Promise<{
    items: ProductSummaryDTO[];
    pagination: {
      total_items: number;
      total_pages: number;
      current_page: number;
      per_page: number;
    };
  }>;

  find(id: number): Promise<ProductCatalogDTO>;
}
