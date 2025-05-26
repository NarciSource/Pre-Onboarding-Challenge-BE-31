import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";

import QueryRepository from "./Query.repository";

interface ITestDoc {
  name: string;
}

const mockQueryBuilder = {
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([] as ITestDoc[]),
};

const mockInstance: Partial<ITestDoc> & { save: jest.Mock } = {
  save: jest.fn().mockResolvedValue(undefined),
};

const mockModel = Object.assign(
  jest.fn().mockImplementation((_data: Partial<ITestDoc>) => mockInstance),
  {
    find: jest.fn().mockReturnValue(mockQueryBuilder),
    findOne: jest.fn().mockReturnValue(mockQueryBuilder),
    updateOne: jest.fn().mockReturnValue(mockQueryBuilder),
    updateMany: jest.fn().mockReturnValue(mockQueryBuilder),
    deleteOne: jest.fn().mockReturnValue(mockQueryBuilder),
    aggregate: jest.fn().mockReturnValue(mockQueryBuilder),
    collection: { name: "testmodels" },
  },
) as unknown as Model<ITestDoc> & jest.Mock;

describe("QueryRepository", () => {
  let model: jest.MockedFunction<typeof mockModel>;
  let repository: QueryRepository<ITestDoc>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken("TestModel"),
          useValue: mockModel,
        },
        {
          provide: QueryRepository,
          useFactory: (model: Model<ITestDoc>) => new QueryRepository<ITestDoc>(model),
          inject: [getModelToken("TestModel")],
        },
      ],
    }).compile();

    model = module.get(getModelToken("TestModel"));
    repository = module.get(QueryRepository);
  });

  describe("함수 호출 테스트", () => {
    it("find", async () => {
      await repository.find({ where: {}, order: { name: "ASC" }, take: 10, skip: 0 });

      expect(model.find).toHaveBeenCalled();
    });

    it("findOne", async () => {
      await repository.findOne({ name: "제품" });

      expect(model.findOne).toHaveBeenCalled();
    });

    it("save", async () => {
      await repository.save({ name: "제품" });

      expect(mockInstance.save).toHaveBeenCalled();
    });

    it("updateOne", async () => {
      await repository.updateOne({ name: "제품" }, { $set: { age: 22 } });

      expect(model.updateOne).toHaveBeenCalled();
    });

    it("update", async () => {
      await repository.update({ age: { $gt: 30 } }, { $set: { retired: true } });

      expect(model.updateMany).toHaveBeenCalled();
    });

    it("delete", async () => {
      await repository.delete({ name: "제품" });

      expect(model.deleteOne).toHaveBeenCalled();
    });

    it("aggregation", async () => {
      const docs = [{ _id: "1", __v: 0, name: "제품", age: 30 }];
      model.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(docs),
      });

      const result = await repository.aggregate([{ $match: {} }]);

      expect(result).toEqual([{ name: "제품", age: 30 }]);
    });
  });

  it("model_name", () => {
    expect(repository.model_name).toBe("testmodels");
  });
});
