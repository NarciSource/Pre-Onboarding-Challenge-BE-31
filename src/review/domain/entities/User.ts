export default class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public avatar_url: string | null,
    public created_at: Date,
  ) {}
}
