import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app, BrowserWindow, Menu } from "electron";
import fs from "fs";
import { createMenu, setWindowMenu } from "../menu.js";

vi.mock("electron", () => ({
  app: { emit: vi.fn(), quit: vi.fn() },
  BrowserWindow: { getFocusedWindow: vi.fn() },
  Menu: {
    buildFromTemplate: vi.fn((template) => ({ items: template })),
    setApplicationMenu: vi.fn(),
  },
}));
vi.mock("fs", () => ({ default: { existsSync: vi.fn() } }));
vi.mock("../../utils/paths.js", () => ({ getAppPath: () => "/app" }));
vi.mock("../../windows/mainWindow.js", () => ({
  getCurrentView: () => "logging-view",
}));
vi.mock("../../windows/aboutWindow.js", () => ({ showAboutWindow: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  fs.existsSync.mockReturnValue(true);
});
afterEach(() => vi.unstubAllGlobals());

describe("Control Station menu", () => {
  it("orders reload, available views, return to selector and quit", () => {
    const menu = createMenu();
    expect(menu.items[0].label).toBe("Control Station");
    expect(
      menu.items[0].submenu
        .filter((item) => item.label)
        .map((item) => item.label),
    ).toEqual([
      "Reload",
      "Testing View",
      "Competition View",
      "Flashing View",
      "Logging View",
      "ADJ Viewer",
      "Return to Selector",
      "Quit",
    ]);
  });

  it("only offers views whose entry point is installed", () => {
    fs.existsSync.mockImplementation(
      (file) => file === "/app/renderer/logging-view/index.html",
    );
    const items = createMenu().items[0].submenu;
    expect(
      items
        .filter((item) => item.label?.endsWith("View"))
        .map((item) => item.label),
    ).toEqual(["Logging View"]);
    expect(items.some((item) => item.label === "ADJ Viewer")).toBe(false);
  });

  it("requests a mode change for each destination", () => {
    const items = createMenu().items[0].submenu;
    for (const [label, mode] of [
      ["Testing View", "testing"],
      ["Competition View", "competition"],
      ["Flashing View", "flashing"],
      ["Logging View", "logging"],
      ["ADJ Viewer", "adj"],
    ]) {
      items.find((item) => item.label === label).click();
      expect(app.emit).toHaveBeenLastCalledWith("switch-mode", mode);
    }
  });

  it("reloads the invoking window rather than whichever window is focused", () => {
    const window = { reload: vi.fn() };
    createMenu().items[0].submenu[0].click(null, window);
    expect(window.reload).toHaveBeenCalledOnce();
    expect(BrowserWindow.getFocusedWindow).not.toHaveBeenCalled();
  });

  it("preserves the selector menu without mode switching or nested selectors", () => {
    const menu = createMenu({ isSelector: true });
    expect(menu.items[0].label).toBe("File");
    expect(
      menu.items[0].submenu
        .filter((item) => item.label)
        .map((item) => item.label),
    ).toEqual(["Reload", "Return to Selector", "Exit"]);
    expect(
      menu.items[0].submenu.find((item) => item.label === "Return to Selector")
        .enabled,
    ).toBe(false);
  });

  it("assigns menus per window on Windows and Linux", () => {
    vi.stubGlobal("process", { ...process, platform: "linux" });
    const window = { setMenu: vi.fn() };
    setWindowMenu(window);
    expect(window.setMenu.mock.calls[0][0].items[0].label).toBe(
      "Control Station",
    );
    expect(Menu.setApplicationMenu).not.toHaveBeenCalled();
  });

  it("updates the macOS application menu when a window gains focus", () => {
    vi.stubGlobal("process", { ...process, platform: "darwin" });
    const window = { on: vi.fn(), isFocused: () => false };
    setWindowMenu(window, { isSelector: true });
    expect(window.on).toHaveBeenCalledWith("focus", expect.any(Function));
    window.on.mock.calls[0][1]();
    expect(Menu.setApplicationMenu.mock.calls[0][0].items[0].label).toBe(
      "File",
    );
  });
});
