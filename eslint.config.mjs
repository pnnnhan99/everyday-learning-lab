import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Git submodule with its own workspace, lint config, and tooling.
    // Not imported by this app; linted inside its own package.
    "external-packages/**",
    // Runtime data and generated artifacts.
    ".data/**",
    "drizzle/**",
  ]),
]);

export default eslintConfig;
