import { expect, test } from "@playwright/test";

test("a user can add, complete, and delete a task", async ({ page }) => {
  const title = "Read the testing guide";

  await page.goto("/example");
  await page.getByRole("textbox", { name: "Task title" }).fill(title);
  await page.getByRole("button", { name: "Add task" }).click();

  const task = page.getByRole("listitem").filter({ hasText: title });
  await expect(task).toBeVisible();

  const completeButton = task.getByRole("button", { name: `Mark ${title} as complete` });
  await completeButton.click();
  await expect(task.getByRole("button", { name: `Mark ${title} as incomplete` })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await task.getByRole("button", { name: `Delete ${title}` }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Delete task" }).click();
  await expect(task).toHaveCount(0);
});
