import { ObjectLiteral, Repository } from "typeorm";

import { ProductSummaryDTO } from "@browsing/presentation/dto";

export default interface IBrowsingRepository<T extends ObjectLiteral> extends Repository<T> {
  find_by_filters(filters: {
    page?: number;
    per_page?: number;
    sort_field: string;
    sort_order: string;
    status?: string;
    min_price?: number;
    max_price?: number;
    category?: number[];
    seller?: number;
    brand?: number;
    search?: string;
  }): Promise<ProductSummaryDTO[]>;
}
