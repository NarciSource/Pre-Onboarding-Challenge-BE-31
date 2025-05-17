export default interface IQueryRepository<T> {
  findAll();

  findById(id: number);

  create(data: Partial<T>);

  update(id: string, data: Partial<T>);

  delete(id: string);
}
