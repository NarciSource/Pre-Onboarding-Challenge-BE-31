import { ProductSummaryModel } from "@libs/infrastructure/mongo/models";

import { TopicName } from "./topicEventMap";

export enum DebeziumOperation {
  CREATE = "c",
  UPDATE = "u",
  DELETE = "d",
  READ = "r",
}

export interface DebeziumMessage<T> {
  before: T | null;
  after: T | null;
  op: DebeziumOperation;
  source: {
    version: string;
    connector: "mongodb";
    name: string;
    ts_ms: number;
    snapshot: "true" | "false" | "last";
    db: string;
    collection: TopicName;
    ts_us?: number;
    ts_ns?: number;
    sequence?: number | null;
    ord?: number;
    lsid?: unknown;
    txnNumber?: number | null;
    wallTime?: string | null;
  };
  ts_ms: number;
  transaction?: null;
}

export default interface TableEntityMap {
  product_summary: ProductSummaryModel & { _id: string; __v: string };
}

export type TableEntity = keyof TableEntityMap;
export type TableEntityType<T extends TableEntity> = TableEntityMap[T];
