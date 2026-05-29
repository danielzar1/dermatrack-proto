import { test, expect } from "@playwright/test";

// Slice-1 acceptance criteria (ARCHITECTURE.md §3). These encode the loop
// we will build; marked fixme until the slice is implemented so CI shows
// them as pending rather than passing vacuously.

test.describe("Slice 1 — patient capture → clinician review loop", () => {
  test("landing offers patient and clinician entry", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Continue as Patient" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Continue as Clinician" })).toBeVisible();
  });

  test.fixme("patient consent gate blocks PHI until required consents granted", async () => {});
  test.fixme("patient creates a lesion and uploads a photo (stored private)", async () => {});
  test.fixme("clinician sees only care-linked, consented patients", async () => {});
  test.fixme("clinician views photo and adds a review note", async () => {});
  test.fixme("every PHI access produced an audit_log row", async () => {});
  test.fixme("withdrawing share consent revokes clinician access immediately", async () => {});
});
