import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { Kafka, Consumer, KafkaMessage } from "kafkajs";

import ProjectionService from "./service";
import topicEventMap from "./topicEventMap";

jest.mock("kafkajs", () => {
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      consumer: jest.fn(() => ({
        connect: jest.fn(),
        disconnect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn(),
      })),
    })),
    Consumer: jest.fn(),
  };
});

describe("ConsumerService", () => {
  let service: ProjectionService;
  let eventBus: EventBus;
  let kafka: Kafka;
  let consumer: Consumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "KAFKA_HOST") return "localhost";
              if (key === "KAFKA_PORT") return 9092;
              return undefined;
            }),
          },
        },
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(ProjectionService);
    eventBus = module.get(EventBus);
    ({ kafka, consumer } = service as ProjectionService & { kafka: Kafka; consumer: Consumer });
  });

  it("Kafka와 Consumer 생성 확인", () => {
    expect(kafka).toBeDefined();
    expect(consumer).toBeDefined();
  });

  it("onModuleInit에서 consumer가 connect, subscribe, run 호출", async () => {
    await service.onModuleInit();

    expect(consumer.connect).toHaveBeenCalled();
    expect(consumer.subscribe).toHaveBeenCalled();
    expect(consumer.run).toHaveBeenCalled();
  });

  it("onModuleDestroy에서 consumer.disconnect가 호출", async () => {
    await service.onModuleDestroy();

    expect(consumer.disconnect).toHaveBeenCalled();
  });

  describe("dispatch", () => {
    const topic = "product-events";
    const op = "c";
    const before = { id: 1, name: "old" };
    const after = { id: 1, name: "new" };
    const source = { table: "product" };

    it("EventClass가 존재하면 publish가 호출", async () => {
      const EventClass = jest.fn().mockImplementation(() => ({}));
      topicEventMap[topic] = { [op]: EventClass };

      const message = {
        value: Buffer.from(JSON.stringify({ op, before, after, source })),
      } as KafkaMessage;

      await service.dispatch(topic, message);

      expect(EventClass).toHaveBeenCalledWith(source.table, before, after);
      expect(eventBus.publish).toHaveBeenCalled();
    });

    it("EventClass가 없으면 publish가 호출 안함", async () => {
      topicEventMap[topic] = {};

      const message = {
        value: Buffer.from(JSON.stringify({ op, before, after, source })),
      } as KafkaMessage;

      await service.dispatch(topic, message);

      expect(eventBus.publish).not.toHaveBeenCalled();
    });
  });
});
