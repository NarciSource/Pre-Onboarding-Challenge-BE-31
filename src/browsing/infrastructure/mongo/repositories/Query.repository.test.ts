import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model, Document } from "mongoose";
import QueryRepository from "./Query.repository";

interface TestDoc extends Document {
  id: number;
  name: string;
}

describe("QueryRepository", () => {
  let repository: QueryRepository<TestDoc>;
  let model: Model<TestDoc>;

  const mockModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
  } as unknown as Model<TestDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryRepository,
        {
          provide: getModelToken("TestModel"),
          useValue: mockModel,
        },
      ],
    }).compile();

    model = module.get<Model<TestDoc>>(getModelToken("TestModel"));
    repository = new QueryRepository<TestDoc>(model);

    jest.clearAllMocks();
  });

  describe("find", () => {
    it("조건에 맞는 문서들을 반환한다", async () => {
      const docs = [
        { _id: "1", id: 1, name: "A" },
        { _id: "2", id: 2, name: "B" },
      ] as TestDoc[];
      const lean = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(docs) });
      const sort = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ lean }) }),
      });
      mockModel.find = jest.fn().mockReturnValue({ sort });

      const result = await repository.find({
        where: { name: "A" },
        order: { id: "ASC" },
        take: 10,
        skip: 0,
      });

      expect(mockModel.find).toHaveBeenCalledWith({ name: "A" });
      expect(result).toEqual([
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ]);
    });
  });

  describe("findOneBy", () => {
    it("조건에 맞는 단일 문서를 반환한다", async () => {
      const doc = { _id: "1", id: 1, name: "A" } as TestDoc;
      const lean = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) });
      mockModel.findOne = jest.fn().mockReturnValue({ lean });

      const result = await repository.findOneBy({ id: 1 });

      expect(mockModel.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ id: 1, name: "A" });
    });

    it("문서가 없으면 null을 반환한다", async () => {
      const lean = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      mockModel.findOne = jest.fn().mockReturnValue({ lean });

      const result = await repository.findOneBy({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe("save", () => {
    it("새로운 문서를 저장한다", async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      const originalConstructor = model.constructor;
      (model as unknown as Model<TestDoc>).constructor = function (
        this: TestDoc,
        data: Partial<TestDoc>,
      ) {
        Object.assign(this, data);
        (this as TestDoc & { save: jest.Mock }).save = save;
        return this;
      };

      await repository.save({ id: 1, name: "A" });

      expect(save).toHaveBeenCalled();
      (model as unknown as Model<TestDoc>).constructor = originalConstructor;
    });
  });

  describe("update", () => {
    it("id로 문서를 업데이트한다", async () => {
      mockModel.updateOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(undefined) });

      await repository.update(1, { name: "B" });

      expect(mockModel.updateOne).toHaveBeenCalledWith({ id: 1 }, { name: "B" }, { upsert: true });
    });
  });

  describe("delete", () => {
    it("id로 문서를 삭제한다", async () => {
      mockModel.deleteOne = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(undefined) });

      await repository.delete(1);

      expect(mockModel.deleteOne).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
