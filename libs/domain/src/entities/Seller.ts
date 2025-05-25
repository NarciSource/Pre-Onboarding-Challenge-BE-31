export default class Seller {
  constructor(
    public id: number,
    public name: string,
    public description: string | null,
    public logo_url: string | null,
    public rating: number | null,
    public contact_email: string | null,
    public contact_phone: string | null,
  ) {}
}
