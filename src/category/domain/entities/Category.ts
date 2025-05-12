export default class Category {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public description: string | null,
    public parent: Category | null,
    public level: number,
    public image_url: string | null,
  ) {}
}
