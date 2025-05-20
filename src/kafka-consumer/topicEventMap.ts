import { DebeziumOperation } from "./dto";
import {
  MerchantUpsertEvent,
  ProductDeleteEvent,
  ProductUpsertEvent,
  ReviewCreateEvent,
  ReviewDeleteEvent,
  ReviewUpdateEvent,
} from "./event";
import ProjectionEvent from "./ProjectionEvent";

type EventConstructor = new (...args: unknown[]) => ProjectionEvent;

type EventMapping = {
  [topic: string]: {
    [op in DebeziumOperation]?: EventConstructor;
  };
};

const topicEventMap: EventMapping = {
  "product-events": {
    c: ProductUpsertEvent,
    u: ProductUpsertEvent,
    r: ProductUpsertEvent,
    d: ProductDeleteEvent,
  },
  "merchant-events": {
    c: MerchantUpsertEvent,
    u: MerchantUpsertEvent,
    r: MerchantUpsertEvent,
  },
  "review-events": {
    c: ReviewCreateEvent,
    u: ReviewUpdateEvent,
    r: ReviewCreateEvent,
    d: ReviewDeleteEvent,
  },
};

export default topicEventMap;

export type TopicName = keyof typeof topicEventMap;
