import js from "@eslint/js";
import ts from "typescript-eslint";
import prettierEslint from "eslint-config-prettier";
import tsdoc from "eslint-plugin-tsdoc";
import * as importPlugin from "eslint-plugin-import-x";
import {includeIgnoreFile} from "@eslint/compat";

import * as path from "path";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
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
    ignores: [
      ".yarn", "tools/**", "**/*.js"

    ],
    plugins: {
      tsdoc,
    },
    settings: {},
    rules: {
      // Avoiding `any` is good practice in TypeScript
      // Many users of TypeScript struggle to avoid `any` though and this rule helps make sure they do.
      // `foundry-vtt-types` ships with common helper types like `AnyObject`, `AnyArray`, `AnyFunction`, etc.
      // If you're still having problems feel free to ask for help avoiding `any` on the League Of Extraordinary developers Discord.
      // However if you an very experienced user of TypeScript there are some niche uses of `any` and you can disable this rule, though using a `eslint-ignore` directive would be recommended.
      "@typescript-eslint/no-explicit-any": "off", //Meh
      //
      "@typescript-eslint/no-unused-vars": [
        "error",
        // Ignore unused parameters and caught errors that are prefixed with an underscore.
        // These are generally the two cases where throwing away a variable makes sense.
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": ["off"], //Meh
      "@typescript-eslint/ban-ts-comment": ["off"], //Meh
      "prefer-const": ["off"], //Meh (but I should fix this one I guess)
      "import-x/no-unresolved": ["off"], //Meh. Seems to work fine in practice despite whatever eslint says is wrong?

      "tsdoc/syntax": "warn",
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "tsdoc/syntax": "off",
    },
  },
  // Add this override for the tools subdirectory:
  {
    files: ["tools/**"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    //Completely ignore js.
    files: ["**/*.js"],
    rules: {},
  }
);
