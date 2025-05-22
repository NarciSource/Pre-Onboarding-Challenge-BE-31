import { DebeziumOperation } from "./dto";
import {
  CategoryUpsertEvent,
  MerchantUpsertEvent,
  ProductDeleteEvent,
  ProductOptionDeleteEvent,
  ProductOptionUpsertEvent,
  ProductUpsertEvent,
  ReviewCreateEvent,
  ReviewDeleteEvent,
  ReviewUpdateEvent,
  TagUpsertEvent,
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
  "product-option-events": {
    c: ProductOptionUpsertEvent,
    u: ProductOptionUpsertEvent,
    r: ProductOptionUpsertEvent,
    d: ProductOptionDeleteEvent,
  },
  "category-events": {
    c: CategoryUpsertEvent,
    u: CategoryUpsertEvent,
    r: CategoryUpsertEvent,
  },
  "tag-events": {
    c: TagUpsertEvent,
    u: TagUpsertEvent,
    r: TagUpsertEvent,
  },
};

export default topicEventMap;

export type TopicName = keyof typeof topicEventMap;
