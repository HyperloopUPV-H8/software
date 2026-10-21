import type { Page } from "@playwright/test";
import { expect, test } from "../../fixtures/electron";

async function openAdjFromRenderer(page: Page) {
  await page.evaluate(() => {
    const { electronAPI } = window as unknown as {
      electronAPI: { switchView: (view: string) => Promise<string> };
    };
    void electronAPI.switchView("adj-view");
  });
  await expect(page).toHaveURL(/\/adj-view\/index\.html$/);
}

test("Control Station menu switches modes and returns through the selector", async ({
  app,
}) => {
  test.setTimeout(60_000);

  const labels = await app.evaluate(({ Menu }) => {
    const menu = Menu.getApplicationMenu()!;
    return {
      title: menu.items[0].label,
      items: menu.items[0]
        .submenu!.items.filter((item) => item.type !== "separator")
        .map((item) => item.label),
    };
  });
  expect(labels.title).toBe("Control Station");
  expect(labels.items[0]).toBe("Reload");
  expect(labels.items.slice(-2)).toEqual(["Return to Selector", "Quit"]);
  test.skip(
    !labels.items.includes("Logging View") ||
      !labels.items.includes("ADJ Viewer"),
    "Requires Logging and ADJ in the installed build",
  );

  await app.evaluate(({ BrowserWindow, Menu }) => {
    const menu = Menu.getApplicationMenu()!;
    const logs = BrowserWindow.getAllWindows().find((window) =>
      window.webContents.getURL().includes("/log-viewer/"),
    )!;
    const item = menu.items[0].submenu!.items.find(
      (item) => item.label === "Logging View",
    )!;
    item.click(item, logs, {} as never);
  });
  await expect
    .poll(() =>
      app
        .windows()
        .filter((window) => !window.isClosed())
        .map((window) => window.url()),
    )
    .toEqual([expect.stringContaining("/logging-view/index.html")]);

  // Exercise renderer navigation: this fails if the old main window cleared
  // the replacement's reference when it closed.
  const logging = app
    .windows()
    .find((window) => window.url().includes("/logging-view/index.html"))!;
  await logging.waitForLoadState("domcontentloaded");
  await openAdjFromRenderer(logging);

  await app.evaluate(({ BrowserWindow, Menu }) => {
    const window = BrowserWindow.getAllWindows()[0];
    const item = Menu.getApplicationMenu()!.items[0].submenu!.items.find(
      (item) => item.label === "Return to Selector",
    )!;
    item.click(item, window, {} as never);
  });
  await expect
    .poll(() =>
      app
        .windows()
        .some((window) => window.url().includes("/mode-selector/index.html")),
    )
    .toBe(true);
  const selector = app
    .windows()
    .find((window) => window.url().includes("/mode-selector/index.html"))!;
  await selector
    .getByRole("button", { name: "Logging View", exact: true })
    .click();
  await expect
    .poll(() =>
      app
        .windows()
        .filter((window) => !window.isClosed())
        .map((window) => window.url()),
    )
    .toEqual([expect.stringContaining("/logging-view/index.html")]);
  const replacement = app
    .windows()
    .find((window) => window.url().includes("/logging-view/index.html"))!;
  await replacement.waitForLoadState("domcontentloaded");
  await openAdjFromRenderer(replacement);
});
