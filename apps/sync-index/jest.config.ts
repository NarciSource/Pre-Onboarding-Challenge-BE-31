import type { Config } from "jest";

import baseConfig from "../../jest.base-config";

const config: Config = {
  ...baseConfig,

  displayName: "sync",

  // The root directory that Jest should scan for tests and modules within
  rootDir: "../..",
};

export default config;
