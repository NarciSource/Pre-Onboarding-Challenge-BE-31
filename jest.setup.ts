import { mockEntityManager } from "./src/__mocks__/entityManagerMock";
import * as mockRepositoryMocks from "./src/__mocks__/repositoryMock";
import { MockRepository } from "./src/__mocks__/repositoryMock";
import { stop_test_module } from "./src/__test-utils__/test-module";

global.mockEntityManager = mockEntityManager;

Object.entries(mockRepositoryMocks).forEach(([key, value]) => {
  global[key] = value as MockRepository;
});

afterAll(async () => {
  await stop_test_module();
});
