# Landing-page navigation

The landing page introduces the template and gives a user a visible route into the interactive task demo.

## Sub-features

- `landing-render` shows the template title and introduction at `/`.
- `landing-open-example` follows `View example` to the task demo.

## How to get to it (user POV)

- Open the site root at `/`.
- Choose the `View example` link.

## Driving it with verify-nextjs-template

Preconditions:

- The isolated production server passes the Doctor check.
- `VERIFY_BASE_URL` and `VERIFY_RUN_DIR` are set by the Launch section.

- **Open the landing page.** Run the navigation scenario:

  ```bash
  node .agents/skills/verify-nextjs-template/scripts/drive-task-flow.mjs \
    --base-url "$VERIFY_BASE_URL" \
    --artifacts "$VERIFY_RUN_DIR" \
    --scenario navigation
  ```

  The helper visits `/`, captures `navigation-01-landing.png`, chooses the `View example` link, and confirms the page URL ends in `/example` with the `Keep your next steps clear.` heading.

## Gotchas

- The route has no authentication or data preconditions.
- Confirm the destination heading as well as the URL; a URL change alone is not proof that the example rendered.
