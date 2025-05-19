import { TableEntity, TableEntityMap } from "@kafka-consumer/dto";

export default class ProductUpsertEvent<K extends TableEntity> {
  constructor(
    public readonly table: K,
    public readonly data: TableEntityMap[K],
  ) {}
}
