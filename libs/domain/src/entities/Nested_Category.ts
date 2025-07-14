export default class Nested_Category {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public description: string | null,
    public image_url: string | null,
    public children: Nested_Category | null,
  ) {}
}
