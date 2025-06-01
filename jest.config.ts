import type { Config } from "jest";

const config: Config = {
  testTimeout: 100000,

  // Stop running tests after `n` failures
  bail: 5,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "dist/coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["html", "lcov", "text-summary"],

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules", "src"],

  // Run tests from one or more projects
  projects: ["<rootDir>/apps/api-server", "<rootDir>/apps/proj-docs"],

  // Use this configuration option to add custom reporters to Jest
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        pageTitle: "Test Report",
        publicPath: "./dist",
        filename: "test-report.html",
        includeFailureMsg: true,
        expand: true,
      },
    ],
  ],

  // The root directory that Jest should scan for tests and modules within
  rootDir: ".",

  // The test environment that will be used for testing
  testEnvironment: "node",
};

export default config;
