---
name: verify-nextjs-template
description: Drive and prove the Next.js frontend template's landing-page navigation and task-demo user flows with an isolated production server. Use after changing app behavior, task UI, task Route Handlers, or the associated Playwright coverage.
---

# Verify the Next.js frontend template

Use this skill to prove the browser-visible behavior of this repository. The primary surface is the Next.js web UI: the landing page at `/` and the task demo at `/example`. The task Route Handlers are exercised only through that UI. Storybook covers component states and interactions; Vitest covers schemas and pure logic.

The app has no authentication, database, seed data, or durable task storage. Each task is created by the user flow and exists only in the browser state for the verification run.

## Launch

Run the following from the repository root. It builds the production app, launches one isolated server on port 3100, and records the exact PID that this run owns. Set a different unused `VERIFY_PORT` for simultaneous runs.

```bash
export VERIFY_PORT=3100
export VERIFY_BASE_URL="http://127.0.0.1:${VERIFY_PORT}"
export VERIFY_RUN_ID="$(date +%Y%m%d-%H%M%S)"
export VERIFY_RUN_DIR=".agents/skills/verify-nextjs-template/artifacts/${VERIFY_RUN_ID}"
mkdir -p "$VERIFY_RUN_DIR"

APP_URL="$VERIFY_BASE_URL" pnpm build
APP_URL="$VERIFY_BASE_URL" zsh -c 'exec ./node_modules/.bin/next start --hostname 127.0.0.1 --port "$1"' zsh "$VERIFY_PORT" >"$VERIFY_RUN_DIR/server.log" 2>&1 &
server_pid=$!
printf '%s\n' "$server_pid" >"$VERIFY_RUN_DIR/server.pid"
```

The server is ready only after the Doctor check confirms both the expected page content and the PID-owned listening port. Do not reuse a server that another task started.

## Doctor

Run this before driving the app whenever the server state is uncertain. It is read-only against the running app and proves that the saved PID owns the expected listening port.

```bash
test -s "$VERIFY_RUN_DIR/server.pid"
server_pid="$(cat "$VERIFY_RUN_DIR/server.pid")"
kill -0 "$server_pid"
lsof -nP -a -p "$server_pid" -iTCP:"$VERIFY_PORT" -sTCP:LISTEN

for attempt in {1..30}; do
  if curl --fail --silent --show-error "$VERIFY_BASE_URL/example" >"$VERIFY_RUN_DIR/doctor-example.html"; then
    break
  fi
  sleep 1
done
rg --quiet --fixed-strings "Task demo" "$VERIFY_RUN_DIR/doctor-example.html"
```

If `curl` never succeeds, inspect `server.log`, clean up the PID below, and do not drive the instance. If the `lsof` output does not name the saved PID, do not use that port.

## Drive

The helper starts a real Chromium browser and uses only accessible, user-visible handles. It writes screenshots, an ARIA snapshot, and an action/HTTP transcript to the artifact directory.

```bash
node .agents/skills/verify-nextjs-template/scripts/drive-task-flow.mjs \
  --base-url "$VERIFY_BASE_URL" \
  --artifacts "$VERIFY_RUN_DIR" \
  --scenario happy-path
```

The `happy-path` scenario visits `/example`, adds a task, observes the created task, marks it complete, opens deletion confirmation, then deletes it. It verifies the corresponding `POST` (201), `PATCH` (200), and `DELETE` (204) Route Handler responses as part of the same user path.

Run these focused checks when their behavior changed:

```bash
node .agents/skills/verify-nextjs-template/scripts/drive-task-flow.mjs \
  --base-url "$VERIFY_BASE_URL" \
  --artifacts "$VERIFY_RUN_DIR" \
  --scenario validation

node .agents/skills/verify-nextjs-template/scripts/drive-task-flow.mjs \
  --base-url "$VERIFY_BASE_URL" \
  --artifacts "$VERIFY_RUN_DIR" \
  --scenario navigation
```

Use `pnpm test:storybook` for changed component interactions and accessibility states. Use `APP_URL="$VERIFY_BASE_URL" pnpm verify` for the repository-wide gate: Vitest does not load `.env.local`, so `APP_URL` must be explicit for that command.

## Evidence

Artifacts live at `.agents/skills/verify-nextjs-template/artifacts/<run-id>/` and are ignored by Git. Keep them after cleanup.

- `doctor-example.html` proves the expected page was served by the isolated instance.
- `happy-path-01-created.png`, `happy-path-02-completed.png`, `happy-path-03-delete-confirmation.png`, and `happy-path-04-deleted.png` prove each visible task state.
- `happy-path.aria.yml` captures the final accessible UI tree.
- `happy-path.json` records the route, user actions, and HTTP statuses observed during the browser run.

The proof standard is the real browser journey plus visible state and Route Handler side effects. Do not call task API endpoints directly or manipulate component state to claim the journey passed.

## Cleanup

Only stop the process that this run recorded. Do not kill by process name or use a broad port-based kill; another task may own a nearby server.

```bash
server_pid="$(cat "$VERIFY_RUN_DIR/server.pid")"
if kill -0 "$server_pid" 2>/dev/null; then
  kill "$server_pid"
  wait "$server_pid" 2>/dev/null || true
fi
```

The app has no persistent task data to remove. Keep `server.log` and all proof artifacts in the run directory.

## Helpers

`scripts/drive-task-flow.mjs` is executable and requires the repository's existing `@playwright/test` dependency. Invoke it with `node` exactly as shown in Drive; it does not launch or stop a server itself.
