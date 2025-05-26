import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "../../tsconfig.json";

const config: Config = {
  displayName: "worker",

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: "<rootDir>/jest.global-setup.ts",

  // A path to a module which exports an async function that is triggered once after all test suites
  globalTeardown: "<rootDir>/jest.teardown.ts",

  // The root directory that Jest should scan for tests and modules within
  rootDir: "../..",

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};

export default config;
