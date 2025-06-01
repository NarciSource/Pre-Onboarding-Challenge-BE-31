import { SummarySyncEvent } from "./events";
import BaseEvent from "./events/BaseEvent";
import { DebeziumOperation } from "./TableEntityMap";

type EventConstructor = new (...args: unknown[]) => BaseEvent;

type EventMapping = {
  [topic: string]: {
    [op in DebeziumOperation]?: EventConstructor;
  };
};

const topicEventMap: EventMapping = {
  "mongo_connector.db.productsummarymodels": {
    c: SummarySyncEvent,
    u: SummarySyncEvent,
    r: SummarySyncEvent,
    d: SummarySyncEvent,
  },
};

export default topicEventMap;

export type TopicName = keyof typeof topicEventMap;
