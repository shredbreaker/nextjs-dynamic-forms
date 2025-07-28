const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@cms-data/(.*)$": "<rootDir>/src/packages/cms-data/$1",
    "^@cms/(.*)$": "<rootDir>/src/packages/cms/$1",
    "^@shared-ui/(.*)$": "<rootDir>/src/packages/shared-ui/$1",
  },
  testEnvironment: "jsdom",
  coverageProvider: "v8",
  // Only run files with .test.ts(x) extension
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  // Ignore utility files and empty test files
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/dist/",
    "/__tests__/utils/",
    "/__tests__/index.ts",
    "/property-test-generator.ts",
  ],
};

module.exports = createJestConfig(customJestConfig);
