import { test, expect } from "@playwright/test";

async function login(page, email = "admin@example.com") {
  await page.goto("/");
  await page.getByRole("button", { name: /Shop owner sign in/ }).click();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Hello,/ })).toBeVisible();
  await expect(page.getByText("Gathering the good things…")).toHaveCount(0);
}

test("customers see assigned products, can filter and inspect shop-specific information", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /The everyday,/ }),
  ).toBeVisible();
  await expect(page.locator(".product-card")).toHaveCount(9);
  await expect(page.getByText("Weekend Ceramic Vase")).toHaveCount(0);
  await page.getByLabel("Filter by shop").selectOption("slow-studio");
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page
    .getByRole("button", {
      name: "View Slow Morning Stoneware Mug",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText(
    "Slow Morning Stoneware Mug",
  );
  await expect(dialog.getByText("$26.00")).toBeVisible();
  await expect(dialog.getByText(/Our studio favorite/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page.getByLabel("Search products").fill("not-a-real-product");
  await expect(page.getByText(/No finds here just yet/)).toBeVisible();
  await page.getByRole("button", { name: /Clear filters/ }).click();
  await expect(page.locator(".product-card")).toHaveCount(9);
  expect(errors).toEqual([]);
});

test("administrator can create, edit and remove an owner, shop and catalog product", async ({
  page,
}) => {
  await login(page);
  const suffix = Date.now().toString();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shop owners" })
    .click();
  await page
    .getByRole("button", { name: "Add shop owner", exact: true })
    .click();
  await page.getByLabel("Full name").fill(`Browser Owner ${suffix}`);
  await page.getByLabel("Email address").fill(`browser-${suffix}@example.com`);
  await page
    .getByLabel("Password (at least 8 characters)")
    .fill("testpassword");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("cell", {
      name: `browser-${suffix}@example.com`,
      exact: true,
    }),
  ).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shops", exact: true })
    .click();
  await page.getByRole("button", { name: "Create shop", exact: true }).click();
  await page.getByLabel("Shop name").fill(`Browser Shop ${suffix}`);
  await page.getByLabel("URL slug").fill(`browser-${suffix}`);
  await page
    .getByRole("combobox", { name: "Shop owner", exact: true })
    .selectOption({
      label: `Browser Owner ${suffix} — browser-${suffix}@example.com`,
    });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const shopRow = page
    .getByRole("row")
    .filter({ hasText: `Browser Shop ${suffix}` });
  await expect(shopRow).toBeVisible();
  await shopRow.getByTitle("Edit", { exact: true }).click();
  await page.getByLabel("Shop name").fill(`Updated Shop ${suffix}`);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("row")
    .filter({ hasText: `Updated Shop ${suffix}` })
    .getByTitle("Delete", { exact: true })
    .click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByText(`Updated Shop ${suffix}`, { exact: true }),
  ).toHaveCount(0);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shared catalog" })
    .click();
  await page
    .getByRole("button", { name: "Create product", exact: true })
    .click();
  await page.getByLabel("Product name").fill(`Browser Product ${suffix}`);
  await page.getByLabel("Unique SKU").fill(`BROWSER-${suffix}`);
  await page.getByLabel("Price (USD)").fill("17.50");
  await page
    .getByLabel("Product details")
    .fill("Created by the browser integration test.");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const card = page
    .locator(".product-card")
    .filter({ hasText: `Browser Product ${suffix}` });
  await expect(card).toBeVisible();
  await card.getByTitle("Edit catalog product").click();
  await page.getByLabel("Price (USD)").fill("18.00");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card.getByText("$18.00")).toBeVisible();
  await card.getByTitle("Delete catalog product").click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card).toHaveCount(0);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shop owners" })
    .click();
  await page
    .getByRole("row")
    .filter({ hasText: `browser-${suffix}@example.com` })
    .getByTitle("Delete", { exact: true })
    .click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByTitle("Sign out").click();
  await expect(
    page.getByRole("button", { name: /Shop owner sign in/ }),
  ).toBeVisible();
});

test("shop owner adds a shared product, changes its local price and visibility, then removes it", async ({
  page,
}) => {
  await login(page, "owner@example.com");
  await expect(
    page
      .locator(".sidebar")
      .getByRole("button", { name: "Shop owners", exact: true }),
  ).toHaveCount(0);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shared catalog" })
    .click();
  const card = page
    .locator(".product-card")
    .filter({ hasText: "Weekend Ceramic Vase" });
  await card
    .getByRole("button", { name: "View Weekend Ceramic Vase", exact: true })
    .click();
  await page.getByRole("button", { name: "Add to your shop" }).click();
  await expect(
    page.getByRole("heading", { name: "Create shop listing" }),
  ).toBeVisible();
  await page.getByLabel("Product name").fill("Owner Custom Vase");
  await page.getByLabel("Price (USD)").fill("39.99");
  await page
    .getByLabel("Product details")
    .fill("Only this shop has these custom details.");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shop listings" })
    .click();
  const row = page.getByRole("row").filter({ hasText: "Owner Custom Vase" });
  await expect(row.getByText("$39.99")).toBeVisible();
  await row.getByTitle("Edit", { exact: true }).click();
  await page.getByLabel("Price (USD)").fill("42.00");
  await page.getByLabel("Active and visible to customers").uncheck();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(row.getByText("Hidden", { exact: true })).toBeVisible();
  await expect(row.getByText("$42.00")).toBeVisible();
  await row.getByTitle("Delete", { exact: true }).click();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(row).toHaveCount(0);
});

test("mobile storefront and owner workspace fit the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(9);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "../.tools/storefront-mobile.png",
    fullPage: true,
  });
  await login(page, "owner@example.com");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.locator(".sidebar")).toHaveClass(/mobile-open/);
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Shop listings" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Shop listings", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".sidebar")).not.toHaveClass(/mobile-open/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("desktop storefront and dashboard render without runtime errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".product-card")).toHaveCount(9);
  await page.screenshot({
    path: "../.tools/storefront-desktop.png",
    fullPage: true,
  });
  await login(page);
  await page.screenshot({
    path: "../.tools/dashboard-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
