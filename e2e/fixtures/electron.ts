import {
  _electron as electron,
  test as base,
  type ElectronApplication,
  type Page,
} from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ELECTRON_APP_PATH = path.resolve(__dirname, "../../electron-app");

type ElectronFixtures = {
  app: ElectronApplication;
  windows: { main: Page; logs: Page };
  page: Page;
  logPage: Page;
};

export const test = base.extend<ElectronFixtures>({
  app: async ({}, use) => {
    const app = await electron.launch({
      args: ["--no-sandbox", path.join(ELECTRON_APP_PATH, "main.js")],
      cwd: ELECTRON_APP_PATH,
      env: {
        ...process.env,
        NODE_ENV: "test",
      },
    });

    await use(app);
    await app.close();
  },

  // Startup shows a "Select Mode" window first (see
  // electron-app/src/app/modeSelector.js) that blocks on an IPC event until
  // a mode is chosen. Send it directly instead of clicking a button, so this
  // doesn't depend on how many view folders the build produced.
  //
  // createWindow() runs before createLogWindow() inside the "mode-selected"
  // handler, so Control Station opens before Backend Logs.
  windows: async ({ app }, use) => {
    const selectorWindow = await app.firstWindow();
    await selectorWindow.waitForLoadState("domcontentloaded");
    await selectorWindow.evaluate(() =>
      (window as any).electronAPI.setInitialMode("testing"),
    );

    const main = await app.waitForEvent("window");
    const logs = await app.waitForEvent("window");

    await main.waitForLoadState("domcontentloaded");
    await logs.waitForLoadState("domcontentloaded");

    await use({ main, logs });
  },

  logPage: async ({ windows }, use) => {
    await use(windows.logs);
  },

  // Waits for the app to reach "active" mode before yielding
  page: async ({ windows }, use) => {
    await windows.main.waitForSelector(
      '[data-testid="mode-badge"]:not([data-mode="loading"])',
      { timeout: 15000 },
    );
    await use(windows.main);
  },
});

export { expect } from "@playwright/test";
