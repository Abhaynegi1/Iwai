import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  passWithNoTests: true,
  moduleNameMapper: {
    "^@iwai/shared(.*)$": "<rootDir>/../../packages/shared/src$1",
    "^@iwai/validation(.*)$": "<rootDir>/../../packages/validation/src$1",
    "^@iwai/database(.*)$": "<rootDir>/../../packages/database/src$1",
  },
};

export default config;
