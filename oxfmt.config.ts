import { defineConfig } from "oxfmt";

export default defineConfig({
  sortImports: true,
  sortTailwindcss: {
    stylesheet: "./src/app/globals.css",
    functions: ["clsx", "cn"],
  },
  ignorePatterns: [
    ".next/**",
    "storybook-static/**",
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
  ],
});
