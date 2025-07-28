import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptPaths from "eslint-plugin-typescript-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add typescript-paths plugin - FIXED FORMAT
  {
    plugins: {
      "typescript-paths": typescriptPaths,
    },
  },
  // TypeScript return type rules - only for .ts files
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": [
        "error",
        {
          allowArgumentsExplicitlyTypedAsAny: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
    },
    files: ["**/*.ts"], // Only apply return type rules to .ts files, not .tsx
  },
  // Import order rules - apply to both .ts and .tsx files
  {
    rules: {
      "import/no-duplicates": ["warn", { "prefer-inline": false }],
      "import/no-useless-path-segments": ["warn", { noUselessIndex: true }],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "@shared-ui/**",
              group: "internal",
              position: "before",
            },

            {
              pattern: "@cms-data/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@cms/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "./**",
              group: "sibling",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "never",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "typescript-paths/absolute-import": ["warn", { enableAlias: false }],
      "typescript-paths/absolute-export": ["warn", { enableAlias: false }],
      "typescript-paths/absolute-parent-import": ["warn", { preferPathOverBaseUrl: true }],
    },
    files: ["**/*.ts", "**/*.tsx"], // Apply import order to both .ts and .tsx files
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  // Allow require() in Jest config files
  {
    files: ["jest.config.js", "jest.setup.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "import/no-commonjs": "off",
    },
  },
];

export default eslintConfig;
