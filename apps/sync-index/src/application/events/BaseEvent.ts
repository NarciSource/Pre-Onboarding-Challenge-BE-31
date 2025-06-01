import TableEntityMap from "../TableEntityMap";

export default abstract class BaseEvent<T extends keyof TableEntityMap = keyof TableEntityMap> {
  public before: TableEntityMap[T];
  public after: TableEntityMap[T];

  constructor(
    public collection: T,
    before_str: string | null,
    after_str: string | null,
  ) {
    this.before = (before_str && JSON.parse(before_str)) as TableEntityMap[T];
    this.after = (after_str && JSON.parse(after_str)) as TableEntityMap[T];
  }
}
