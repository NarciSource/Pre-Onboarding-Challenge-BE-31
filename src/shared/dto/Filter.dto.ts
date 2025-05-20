export type FilterDTO = {
  page?: number;
  per_page?: number;
  sort?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  category?: number[];
  seller?: number;
  brand?: number;
  in_stock?: boolean;
  search?: string;
  has_sub?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
};

export default FilterDTO;
