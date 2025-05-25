import type { Config } from "jest";

const config: Config = {
  displayName: "api",

  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: "./jest.global-setup.ts",

  // A path to a module which exports an async function that is triggered once after all test suites
  globalTeardown: "./jest.teardown.ts",

  // The root directory that Jest should scan for tests and modules within
  // rootDir: ".",

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^__test-utils__/(.*)$": "<rootDir>/src/__test-utils__/$1",
    "^utility/(.*)$": "<rootDir>/src/utility/$1",
    "^libs/(.*)$": "<rootDir>/src/libs/$1",
    "^shared/(.*)$": "<rootDir>/src/shared/$1",
    "^product/(.*)$": "<rootDir>/src/product/$1",
    "^category/(.*)$": "<rootDir>/src/category/$1",
    "^review/(.*)$": "<rootDir>/src/review/$1",
    "^browsing/(.*)$": "<rootDir>/src/browsing/$1",
    "^@kafka-consumer/(.*)$": "<rootDir>/src/kafka-consumer/$1",
  },

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        useESM: true,
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts"],
};

export default config;
