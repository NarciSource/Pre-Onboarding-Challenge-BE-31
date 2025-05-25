import Product from "./Product";

export default class Product_Detail {
  constructor(
    public id: number,
    public product: Product,
    public product_id: number,
    public weight: number | null,
    public dimensions: {
      width: number;
      height: number;
      depth: number;
    } | null,
    public materials: string | null,
    public country_of_origin: string | null,
    public warranty_info: string | null,
    public care_instructions: string | null,
    public additional_info: {
      assembly_required: boolean;
      assembly_time: string;
    } | null,
  ) {}
}
