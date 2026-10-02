# Agent Rules

- Keep dependencies flowing `app → features → components/lib`; features must not depend on each other, and shared layers must not depend on features. Avoid barrel exports and speculative root `hooks/` or `types/` directories.
- Import `@base-ui/react` only from `src/components/ui/**` and `lucide-react` only from `src/components/icons/**`.
- Add dependencies only for a concrete current requirement.
- Pure logic belongs in Vitest; component rendering and interactions belong in Storybook; critical user flows belong in Playwright.
- Avoid snapshots. Every lint suppression needs a reason comment. Do not weaken lint, type, or test rules.
- Browser mutations use Route Handlers, not Server Actions by default. Validate untrusted Route Handler input and JSON responses with Zod.
- Read environment variables through `@/lib/env`; never expose secrets with `NEXT_PUBLIC_`. Keep the schema and `.env.example` synchronized when variables are added.
- Run `pnpm verify` before completion.
