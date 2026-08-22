// @ts-check
import tseslint from "typescript-eslint";
import globals from "globals";
import baseConfig from "./base.mjs";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(...baseConfig, {
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
  },
  languageOptions: {
    globals: {
      ...globals.es2022,
    },
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
});
