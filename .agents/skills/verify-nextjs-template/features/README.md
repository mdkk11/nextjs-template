# Next.js frontend template verification map

This directory is the maintained source for verifying the user-facing behavior of the Next.js frontend template. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch a production build with the `verify-nextjs-template` skill on an unused `VERIFY_PORT`; 3100 is the default.
- Set `APP_URL` to the same `VERIFY_BASE_URL` for build and verification commands.
- Run the Doctor check and require its saved PID to own the configured listening port.
- Start every task-demo journey from its empty state. Tasks have no durable storage, so a fresh browser context is sufficient.
- Never drive a server that this verification run did not start.

## Driving conventions

- Prefer roles, accessible names, labels, and visible text over CSS selectors or DOM position.
- Drive a browser with `scripts/drive-task-flow.mjs`; it runs a real Chromium instance against the launched production server.
- Use direct API requests only for API-specific work, never as a substitute for the mapped browser journeys.
- Use `pnpm test:storybook` for component-level interaction and accessibility coverage.

## Proof and skip reporting

- Capture the user action and the resulting state, not only a final success screen.
- Keep the helper's screenshots, ARIA snapshot, and JSON action transcript in the run artifact directory.
- For mutations, record the observed Route Handler status and a visible second state: created task, completed task, deletion confirmation, or removed task.
- If a route or selector is unreachable, report the attempted command and unmet precondition. Do not claim a different entry point proves it.

## Features

- [Landing-page navigation](./landing-page-navigation.md) covers the public route and its link into the example.
- [Task demo](./task-demo.md) covers task creation, validation, completion, deletion confirmation, and deletion.
