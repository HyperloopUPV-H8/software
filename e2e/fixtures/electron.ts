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

    // Surface the app's own logging (and any crash) in the test output —
    // Playwright doesn't forward it by default, which otherwise leaves
    // "Target page, context or browser has been closed" failures with no
    // clue as to why the process actually went away.
    app.process().stdout?.on("data", (d) => process.stdout.write(`[electron] ${d}`));
    app.process().stderr?.on("data", (d) => process.stderr.write(`[electron] ${d}`));
    app.process().on("exit", (code, signal) =>
      console.log(`[electron] process exited (code=${code}, signal=${signal})`),
    );

    await use(app);
    await app.close();
  },

  // Startup shows a "Select Mode" window first (see
  // electron-app/src/app/modeSelector.js) that blocks on an IPC event until
  // a mode is chosen. Send it directly instead of clicking a button, so this
  // doesn't depend on how many view folders the build produced.
  //
  // If the build only contains one view (as the e2e "testing" build does),
  // the selector's own renderer auto-sends that mode as soon as it loads
  // (renderer/mode-selector/index.html), which can win the race against our
  // explicit call and close the selector window before we reach it — so
  // that call is best-effort. Windows are buffered from an event listener
  // rather than awaited sequentially, since window creation can likewise
  // outrun sequential `waitForEvent("window")` calls once a mode is picked.
  //
  // createWindow() runs before createLogWindow() inside the "mode-selected"
  // handler, so among the windows opened after the selector, the first is
  // Control Station and the second is Backend Logs.
  windows: async ({ app }, use) => {
    const seen = new Set<Page>(app.windows());
    app.on("window", (page) => seen.add(page));

    const selectorWindow = await app.firstWindow();
    seen.add(selectorWindow);

    try {
      await selectorWindow.waitForLoadState("domcontentloaded");
      await selectorWindow.evaluate(() =>
        (window as any).electronAPI.setInitialMode("testing"),
      );
    } catch {
      // Selector already auto-selected and closed itself — same outcome.
    }

    const start = Date.now();
    while ([...seen].filter((p) => p !== selectorWindow).length < 2) {
      if (Date.now() - start > 15000) {
        throw new Error(
          "Timed out waiting for Control Station and Backend Logs windows to open",
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const [main, logs] = [...seen].filter((p) => p !== selectorWindow);

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
