import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/support");
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("run-copilot-button")).toBeVisible();
});

test("runs Copilot and records human-approved reply metadata", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "SAML login failing after certificate update" }),
  ).toBeVisible();

  await expect(async () => {
    await page.getByTestId("run-copilot-button").click();
    await expect(page.getByText("Guardrail validation")).toBeVisible({ timeout: 1_000 });
  }).toPass();
  await expect(page.getByText("KB-102: Enterprise SSO certificate rotation")).toBeVisible();

  await page.getByTestId("insert-draft-button").click();
  await expect(page.getByTestId("draft-reply-input")).toHaveValue(
    /Please re-add the previous SAML signing certificate/,
  );

  await page.getByTestId("approve-reply-button").click();

  await expect(page.getByText("Human approval", { exact: true })).toBeVisible();
  await expect(page.getByText("Approved", { exact: true })).toBeVisible();

  await page.getByTestId("system-tab-audit").click();
  await expect(page.getByText("Approved AI-assisted reply for TCK-4821.")).toBeVisible();
});

test("keeps route sections interactive for knowledge and eval workflows", async ({ page }) => {
  await page.getByTestId("ticket-card-TCK-4824").click();

  await expect(page.getByRole("heading", { name: "Duplicate invoice for April renewal" })).toBeVisible();
  await expect(page.getByText("Run Copilot to summarize the issue")).toBeVisible();

  await page.getByTestId("nav-knowledge").click();
  await page.getByTestId("knowledge-search-input").fill("billing");

  await expect(page.getByText("KB-147: Refund exception policy for duplicate billing")).toBeVisible();

  await page.getByTestId("nav-observability").click();
  await page.getByTestId("run-evals-button").click();

  await expect(page.getByText("SLA escalation correctness")).toBeVisible();
  await expect(page.getByText("91% Pass")).toBeVisible();
});
