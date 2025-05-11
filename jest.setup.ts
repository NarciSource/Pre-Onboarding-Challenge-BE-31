import { stop_test_module } from "./src/__test-utils__/test-module";

afterAll(async () => {
  await stop_test_module();
});
