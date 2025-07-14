export default class Featured_Category {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public image_url: string | null,
    public product_count: number,
  ) {}
}
