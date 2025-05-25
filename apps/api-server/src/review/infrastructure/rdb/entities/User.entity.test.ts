import { TestingModule } from "@nestjs/testing";
import { DataSource, UpdateResult } from "typeorm";

import test_module from "__test-utils__/test-module";

import { IBaseRepository } from "@libs/domain/repository";
import UserEntity from "./User.entity";

describe("UserEntity", () => {
  let dataSource: DataSource;
  let repository: IBaseRepository<UserEntity>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    dataSource = module.get(DataSource);
    repository = module.get("IUserRepository");
  });

  describe("UserEntity가 정의", () => {
    it("올바른 테이블 이름", () => {
      const entityMetadata = dataSource.getRepository(UserEntity).metadata;

      expect(entityMetadata.tableName).toBe("users");
    });

    it("기본 키 'id'", () => {
      const entityMetadata = dataSource.getRepository(UserEntity).metadata;

      const primaryColumn = entityMetadata.columns.find((col) => col.propertyName === "id")!;

      expect(primaryColumn).toBeDefined();
      expect(primaryColumn.isPrimary).toBe(true);
      expect(primaryColumn.type).toBe("bigint");
    });
  });

  describe("UserEntity의 CRUD 기능", () => {
    it("UserEntity를 생성", async () => {
      const user = new UserEntity();
      user.name = "John Doe";
      user.email = "john.doe@example.com";
      user.avatar_url = "http://example.com/avatar.jpg";

      repository.save = jest.fn().mockResolvedValue(user);

      const result = await repository.save(user);

      expect(result).toEqual(user);
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john.doe@example.com");
      expect(result.avatar_url).toBe("http://example.com/avatar.jpg");
    });

    it("UserEntity를 삭제", async () => {
      const user = new UserEntity();
      user.id = 1;

      repository.delete = jest.fn().mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await repository.delete(user.id);

      expect(result.affected).toBe(1);
    });

    it("UserEntity를 조회", async () => {
      const user = new UserEntity();
      user.id = 1;
      user.name = "John Doe";
      user.email = "john.doe@example.com";

      repository.findOne = jest.fn().mockResolvedValue(user);

      const result = await repository.findOne({ where: { id: 1 } });

      expect(result).toEqual(user);
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("John Doe");
      expect(result?.email).toBe("john.doe@example.com");
    });
  });
});
