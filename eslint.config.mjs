import eslint from "@eslint/js";
import * as eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import prettier from "prettier";
import tseslint from "typescript-eslint";

const prettierOptions = (await prettier.resolveConfig(".prettierrc")) || {};

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prettier/prettier": ["error", prettierOptions],
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "__test-utils__/*",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@utility/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@libs/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@kafka-consumer/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@shared/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@product/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@category/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@review/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@browsing/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
);
