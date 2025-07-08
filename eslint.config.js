import js from "@eslint/js";
import ts from "typescript-eslint";
import prettierEslint from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import * as importPlugin from "eslint-plugin-import-x";
import { includeIgnoreFile } from "@eslint/compat";

import * as path from "path";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  prettierEslint,
  importPlugin.flatConfigs.recommended,

  includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore")),
  {
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: [".yarn"],
    plugins: {
      tsdoc,
    },
    settings: {
    },
    rules: {
    },
  },
  {
    files: ["**/*.js"],
    rules: {
    },
  },
);
