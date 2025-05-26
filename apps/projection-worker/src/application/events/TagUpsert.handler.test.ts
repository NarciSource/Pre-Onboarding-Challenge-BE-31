import { TestingModule } from "@nestjs/testing";

import { Tag } from "@libs/domain/entities";
import { IQueryRepository } from "@libs/domain/repository";
import test_module from "../../__test-utils__/test-module";
import { TagStateModel } from "../../infrastructure/model";
import TagUpsertEvent from "./TagUpsert.event";
import TagUpsertHandler from "./TagUpsert.handler";

describe("TagUpsertHandler", () => {
  let handler: TagUpsertHandler;

  let tag_state_repository: IQueryRepository<TagStateModel>;

  beforeAll(async () => {
    const module: TestingModule = await test_module;

    handler = module.get(TagUpsertHandler);

    tag_state_repository = module.get("ITagStateRepository");
    tag_state_repository.updateOne = jest.fn();
  });

  it("태그가 추가/수정되면 catalog와 summary의 태그 정보 갱신", async () => {
    const tag = { id: 1, name: "new-tag" } as Tag;
    const event = { after: tag } as TagUpsertEvent;

    await handler.handle(event);

    expect(tag_state_repository.updateOne).toHaveBeenCalledWith({ id: 1 }, tag, { upsert: true });
  });
});
