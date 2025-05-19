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
    connector: string;
    name: string;
    ts_ms: number;
    snapshot?: string;
    db: string;
    sequence?: string;
    schema: string;
    table: string;
    txId?: number;
    lsn?: number;
    xmin?: number | null;
  };
  ts_ms: number;
  ts_us?: number;
  ts_ns?: number;
}
