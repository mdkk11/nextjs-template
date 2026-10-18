#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { chromium } from "@playwright/test";

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const baseUrl = option("--base-url")?.replace(/\/$/, "");
const artifacts = option("--artifacts");
const scenario = option("--scenario") ?? "happy-path";

if (!baseUrl || !artifacts) {
  throw new Error(
    "Usage: node drive-task-flow.mjs --base-url <url> --artifacts <directory> [--scenario <name>]",
  );
}

const artifactDirectory = resolve(artifacts);
const events = [];

function record(action, details = {}) {
  events.push({ action, ...details });
}

async function requireVisible(locator, description) {
  if (!(await locator.isVisible())) {
    throw new Error(`Expected ${description} to be visible.`);
  }
}

async function saveAriaSnapshot(page, filename) {
  const snapshot = await page.locator("body").ariaSnapshot();
  await writeFile(`${artifactDirectory}/${filename}`, snapshot);
}

async function driveHappyPath(page) {
  const title = "Verify the task journey";

  await page.goto(`${baseUrl}/example`, { waitUntil: "networkidle" });
  record("Open task demo", { route: "/example" });

  const createResponse = page.waitForResponse(
    (response) =>
      response.url() === `${baseUrl}/api/tasks` && response.request().method() === "POST",
  );
  await page.getByRole("textbox", { name: "Task title" }).fill(title);
  await page.getByRole("button", { name: "Add task" }).click();
  const created = await createResponse;
  if (created.status() !== 201) {
    throw new Error(`Expected task creation to return 201, received ${created.status()}.`);
  }

  const task = page.getByRole("listitem").filter({ hasText: title });
  await requireVisible(task, "the created task");
  await page.screenshot({ path: `${artifactDirectory}/happy-path-01-created.png`, fullPage: true });
  record("Create task", { title, httpStatus: created.status() });

  const updateResponse = page.waitForResponse(
    (response) =>
      response.url().startsWith(`${baseUrl}/api/tasks/`) && response.request().method() === "PATCH",
  );
  await task.getByRole("button", { name: `Mark ${title} as complete` }).click();
  const updated = await updateResponse;
  if (updated.status() !== 200) {
    throw new Error(`Expected task update to return 200, received ${updated.status()}.`);
  }
  await requireVisible(
    task.getByRole("button", { name: `Mark ${title} as incomplete` }),
    "the completed task control",
  );
  await page.screenshot({
    path: `${artifactDirectory}/happy-path-02-completed.png`,
    fullPage: true,
  });
  record("Complete task", { title, httpStatus: updated.status() });

  await task.getByRole("button", { name: `Delete ${title}` }).click();
  const dialog = page.getByRole("dialog", { name: "Delete task?" });
  await requireVisible(dialog, "the deletion confirmation dialog");
  await page.screenshot({
    path: `${artifactDirectory}/happy-path-03-delete-confirmation.png`,
    fullPage: true,
  });
  record("Open deletion confirmation", { title });

  const deleteResponse = page.waitForResponse(
    (response) =>
      response.url().startsWith(`${baseUrl}/api/tasks/`) &&
      response.request().method() === "DELETE",
  );
  await dialog.getByRole("button", { name: "Delete task" }).click();
  const deleted = await deleteResponse;
  if (deleted.status() !== 204) {
    throw new Error(`Expected task deletion to return 204, received ${deleted.status()}.`);
  }
  if ((await task.count()) !== 0) {
    throw new Error("Expected the deleted task to be absent from the task list.");
  }
  await page.screenshot({ path: `${artifactDirectory}/happy-path-04-deleted.png`, fullPage: true });
  await saveAriaSnapshot(page, "happy-path.aria.yml");
  record("Delete task", { title, httpStatus: deleted.status() });
}

async function driveValidation(page) {
  await page.goto(`${baseUrl}/example`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Add task" }).click();

  const alert = page.getByRole("alert");
  await requireVisible(alert, "the task-title validation alert");
  const alertText = await alert.textContent();
  if (alertText !== "Task title must be between 1 and 100 characters.") {
    throw new Error(`Unexpected validation message: ${alertText}`);
  }

  await page.screenshot({ path: `${artifactDirectory}/validation-01-error.png`, fullPage: true });
  await saveAriaSnapshot(page, "validation.aria.yml");
  record("Reject an empty task title", { alert: alertText });
}

async function driveNavigation(page) {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await requireVisible(
    page.getByRole("heading", { name: "A small, strict Next.js foundation." }),
    "the landing heading",
  );
  await page.screenshot({ path: `${artifactDirectory}/navigation-01-landing.png`, fullPage: true });

  await page.getByRole("link", { name: "View example" }).click();
  await page.waitForURL(`${baseUrl}/example`);
  await requireVisible(
    page.getByRole("heading", { name: "Keep your next steps clear." }),
    "the task-demo heading",
  );
  await page.screenshot({ path: `${artifactDirectory}/navigation-02-example.png`, fullPage: true });
  await saveAriaSnapshot(page, "navigation.aria.yml");
  record("Open the task demo from the landing page", { route: "/example" });
}

await mkdir(artifactDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();

  switch (scenario) {
    case "happy-path":
      await driveHappyPath(page);
      break;
    case "validation":
      await driveValidation(page);
      break;
    case "navigation":
      await driveNavigation(page);
      break;
    default:
      throw new Error(`Unknown scenario: ${scenario}`);
  }

  await writeFile(
    `${artifactDirectory}/${scenario}.json`,
    `${JSON.stringify({ baseUrl, scenario, events }, null, 2)}\n`,
  );
  console.log(`Verified ${scenario}; evidence saved to ${artifactDirectory}`);
} finally {
  await browser.close();
}
