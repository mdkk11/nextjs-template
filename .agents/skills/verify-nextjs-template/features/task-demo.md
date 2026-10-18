# Task demo

The task demo lets a user add a task, mark it complete, open a deletion confirmation dialog, and remove the task.

## Sub-features

- `task-empty` presents an empty-state message before a task exists.
- `task-create` adds a title through the `Add task` form and displays it in the task list.
- `task-validation` rejects an empty title and presents an alert.
- `task-complete` toggles a visible task into its completed state.
- `task-delete-confirmation` opens a dialog before deletion.
- `task-delete` removes a confirmed task from the task list.

## How to get to it (user POV)

- Open `/example` directly.
- Open `/`, then choose the `View example` link.

## Driving it with verify-nextjs-template

Preconditions:

- The isolated production server passes the Doctor check.
- `VERIFY_BASE_URL` and `VERIFY_RUN_DIR` are set by the Launch section.
- Start from a fresh browser context. The app keeps tasks in client state, so the task list begins empty.

- **Create, complete, confirm, and delete.** Run the happy path:

  ```bash
  node .agents/skills/verify-nextjs-template/scripts/drive-task-flow.mjs \
    --base-url "$VERIFY_BASE_URL" \
    --artifacts "$VERIFY_RUN_DIR" \
    --scenario happy-path
  ```

  The helper fills `Task title`, chooses `Add task`, confirms the list item, chooses `Mark <title> as complete`, opens `Delete <title>`, captures the `Delete task?` dialog, and confirms `Delete task`. It records the observed `POST` 201, `PATCH` 200, and `DELETE` 204 responses in `happy-path.json`.

- **Validate an empty title.** Run:

  ```bash
  node .agents/skills/verify-nextjs-template/scripts/drive-task-flow.mjs \
    --base-url "$VERIFY_BASE_URL" \
    --artifacts "$VERIFY_RUN_DIR" \
    --scenario validation
  ```

  The helper chooses `Add task` without a title, requires the `Task title must be between 1 and 100 characters.` alert, and captures `validation-01-error.png`.

## Gotchas

- The Route Handlers return task values but do not persist them. Reopening the page intentionally resets the list.
- `Add task` is not disabled for an empty title; the validation alert is the expected user-visible result.
- The delete action is incomplete until the `Delete task?` dialog's `Delete task` button is chosen.
- `APP_URL` must be supplied explicitly to `pnpm verify`, because Vitest does not load `.env.local`.
