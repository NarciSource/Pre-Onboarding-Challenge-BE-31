import TableEntityMap from "../TableEntityMap";

export default abstract class BaseEvent<T extends keyof TableEntityMap = keyof TableEntityMap> {
  constructor(
    public table: T,
    public before: TableEntityMap[T],
    public after: TableEntityMap[T],
  ) {}
}
