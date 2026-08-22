// @ts-check
import tseslint from "typescript-eslint";
import globals from "globals";
import baseConfig from "./base.mjs";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(...baseConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {
    // NestJS uses decorators and DI patterns that trigger these
    "@typescript-eslint/no-explicit-any": "warn",
    // In NestJS, constructor parameters must be value imports for emitDecoratorMetadata reflection
    "@typescript-eslint/consistent-type-imports": "off",
    // Allow parameter decorators to appear unused
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
});
