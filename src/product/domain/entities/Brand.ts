export default class Brand {
  constructor(
    public id: number,
    public name: string,
    public slug: string,
    public description: string | null,
    public logo_url: string | null,
    public website: string | null,
  ) {}
}
