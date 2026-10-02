import { defineConfig } from "oxlint";

const restrictedBaseDependency = {
  name: "@base-ui/react",
  message: "Import Base UI through src/components/ui wrappers.",
};

const restrictedLucideDependency = {
  name: "lucide-react",
  message: "Import Lucide through src/components/icons wrappers.",
};

const restrictedFeaturePatterns = ["@/features/*", "@/features/*/**"];

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "error",
    pedantic: "off",
    style: "off",
    restriction: "off",
    nursery: "off",
  },
  plugins: [
    "eslint",
    "typescript",
    "oxc",
    "unicorn",
    "react",
    "nextjs",
    "jsx-a11y",
    "import",
    "vitest",
  ],
  options: {
    denyWarnings: true,
    reportUnusedDisableDirectives: "error",
    typeAware: true,
  },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [restrictedBaseDependency, restrictedLucideDependency],
        patterns: [
          {
            group: ["@base-ui/react/*", "lucide-react/*"],
            message: "Import UI dependencies through local wrappers.",
          },
        ],
      },
    ],
    "import/no-cycle": "error",
    "import/no-unassigned-import": "off",
    "react/react-in-jsx-scope": "off",
    "oxc/no-barrel-file": "error",
  },
  overrides: [
    {
      files: ["src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [restrictedBaseDependency, restrictedLucideDependency],
            patterns: [
              {
                group: ["@base-ui/react/*", "lucide-react/*", ...restrictedFeaturePatterns],
                message: "Use local UI wrappers and keep shared layers independent of features.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/components/ui/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "lucide-react",
                message: "Import Lucide through src/components/icons wrappers.",
              },
            ],
            patterns: [
              {
                group: ["lucide-react/*", ...restrictedFeaturePatterns],
                message:
                  "Import Lucide through local wrappers and keep shared layers independent of features.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/components/icons/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "@base-ui/react",
                message: "Import Base UI through src/components/ui wrappers.",
              },
            ],
            patterns: [
              {
                group: ["@base-ui/react/*", ...restrictedFeaturePatterns],
                message:
                  "Import Base UI through local wrappers and keep shared layers independent of features.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/features/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [restrictedBaseDependency, restrictedLucideDependency],
            patterns: [
              {
                group: ["@base-ui/react/*", "lucide-react/*", ...restrictedFeaturePatterns],
                message: "Use local UI wrappers and do not import another feature directly.",
              },
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    ".next/**",
    "storybook-static/**",
    "playwright-report/**",
    "test-results/**",
    "coverage/**",
    "next-env.d.ts",
  ],
});
