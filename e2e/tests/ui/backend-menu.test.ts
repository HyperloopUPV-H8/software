import type { ElectronApplication } from "@playwright/test";
import { expect, test } from "../../fixtures/electron";

async function controlState(app: ElectronApplication) {
  return app.evaluate(({ Menu }) => {
    const menu = Menu.getApplicationMenu()!;
    return {
      visible: menu.getMenuItemById("backend-menu")!.visible,
      stop: menu.getMenuItemById("backend-stop")!.enabled,
      restart: menu.getMenuItemById("backend-restart")!.enabled,
      continue: menu.getMenuItemById("backend-continue")!.enabled,
    };
  });
}

async function invoke(app: ElectronApplication, id: string) {
  await app.evaluate(({ BrowserWindow, Menu }, id) => {
    const item = Menu.getApplicationMenu()!.getMenuItemById(id)!;
    if (!item.enabled) throw new Error(`${id} is disabled`);
    item.click(item, BrowserWindow.getAllWindows()[0], {} as never);
  }, id);
}

async function pressRestartShortcut(app: ElectronApplication, mode: string) {
  // Exercise the application shortcut through Electron's native keyboard input.
  await app.evaluate(({ BrowserWindow }, mode) => {
    const window = BrowserWindow.getAllWindows().find((window) =>
      window.webContents.getURL().includes(`/${mode}-view/index.html`),
    )!;
    window.focus();
    const modifiers: ("control" | "meta" | "shift")[] = [
      process.platform === "darwin" ? "meta" : "control",
      "shift",
    ];
    window.webContents.sendInputEvent({
      type: "keyDown",
      keyCode: "R",
      modifiers,
    });
    window.webContents.sendInputEvent({
      type: "keyUp",
      keyCode: "R",
      modifiers,
    });
  }, mode);
}

test("Logging View has no Backend menu or restart binding", async ({ app }) => {
  const available = await app.evaluate(({ Menu }) =>
    Menu.getApplicationMenu()!.items[0].submenu!.items.some(
      (item) => item.label === "Logging View",
    ),
  );
  test.skip(!available, "Logging View is not installed");
  await app.evaluate(({ BrowserWindow, Menu }) => {
    const item = Menu.getApplicationMenu()!.items[0].submenu!.items.find(
      (item) => item.label === "Logging View",
    )!;
    item.click(item, BrowserWindow.getAllWindows()[0], {} as never);
  });
  await expect
    .poll(() =>
      app
        .windows()
        .some((window) => window.url().includes("/logging-view/index.html")),
    )
    .toBe(true);
  await expect
    .poll(() => controlState(app))
    .toEqual({ visible: false, stop: false, restart: false, continue: false });
});

for (const mode of ["competition", "testing"]) {
  test(`Backend Stop, Continue and Ctrl+Shift+R preserve ${mode} view`, async ({
    app,
  }) => {
    test.setTimeout(90_000);
    const label = mode === "competition" ? "Competition View" : "Testing View";
    const available = await app.evaluate(
      ({ Menu }, label) =>
        Menu.getApplicationMenu()!.items[0].submenu!.items.some(
          (item) => item.label === label,
        ),
      label,
    );
    test.skip(!available, `${label} is not installed`);
    await app.evaluate(({ BrowserWindow, Menu }, label) => {
      const item = Menu.getApplicationMenu()!.items[0].submenu!.items.find(
        (item) => item.label === label,
      )!;
      item.click(item, BrowserWindow.getAllWindows()[0], {} as never);
    }, label);
    await expect
      .poll(
        () =>
          app
            .windows()
            .some((window) =>
              window.url().includes(`/${mode}-view/index.html`),
            ),
        { timeout: 20_000 },
      )
      .toBe(true);
    if (mode !== "testing")
      await expect
        .poll(() =>
          app
            .windows()
            .some((window) =>
              window.url().includes("/testing-view/index.html"),
            ),
        )
        .toBe(false);
    const main = app
      .windows()
      .find((window) => window.url().includes(`/${mode}-view/index.html`))!;

    if ((await controlState(app)).stop) await invoke(app, "backend-stop");
    const stopped = {
      visible: true,
      stop: false,
      restart: true,
      continue: true,
    };
    const running = {
      visible: true,
      stop: true,
      restart: true,
      continue: false,
    };
    await expect.poll(() => controlState(app)).toEqual(stopped);
    await invoke(app, "backend-continue");
    await expect
      .poll(() => controlState(app), { timeout: 15_000 })
      .toEqual(running);
    await expect(main).toHaveURL(
      new RegExp(`/${mode}-view/index\\.html(?:#.*)?$`),
    );

    await invoke(app, "backend-stop");
    await expect.poll(() => controlState(app)).toEqual(stopped);
    await pressRestartShortcut(app, mode);
    await expect
      .poll(() => controlState(app), { timeout: 15_000 })
      .toEqual(running);
    const previousLogs = app
      .windows()
      .find((window) => window.url().includes("/log-viewer/index.html"))!;
    await pressRestartShortcut(app, mode);
    await expect.poll(() => previousLogs.isClosed()).toBe(true);
    await expect
      .poll(() => controlState(app), { timeout: 15_000 })
      .toEqual(running);
    expect(main.isClosed()).toBe(false);
    await expect(main).toHaveURL(
      new RegExp(`/${mode}-view/index\\.html(?:#.*)?$`),
    );
  });
}
