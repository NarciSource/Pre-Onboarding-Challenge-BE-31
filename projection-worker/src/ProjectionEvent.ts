import { TableEntityMap } from "./dto";

export default abstract class ProjectionEvent<
  T extends keyof TableEntityMap = keyof TableEntityMap,
> {
  constructor(
    public table: T,
    public before: TableEntityMap[T],
    public after: TableEntityMap[T],
  ) {}
}
