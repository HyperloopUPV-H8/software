/**
 * @module windows/aboutWindow
 * @description Small "About" window — team logo, SW logo, and author credit.
 * Reachable via the main window's right-click context menu and the
 * Help > About application menu item.
 */

import { BrowserWindow } from "electron";
import path from "path";
import { getAppPath } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

let aboutWindow = null;

/**
 * Shows the About window, creating it if needed. Reuses a single instance —
 * focuses it instead of stacking duplicates if already open.
 * @param {BrowserWindow | null} [parentWindow] - Window to center/modal against.
 * @returns {void}
 */
function showAboutWindow(parentWindow) {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.focus();
    return;
  }

  aboutWindow = new BrowserWindow({
    width: 380,
    height: 440,
    resizable: false,
    minimizable: false,
    maximizable: false,
    modal: !!parentWindow,
    parent: parentWindow ?? undefined,
    title: "About Logging View",
    backgroundColor: "#111111",
    webPreferences: {
      preload: path.join(getAppPath(), "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  aboutWindow.setMenuBarVisibility(false);

  const aboutPath = path.join(getAppPath(), "renderer", "about", "index.html");
  aboutWindow.loadFile(aboutPath).catch((err) => {
    logger.electron.error("Failed to load About window:", err);
  });

  aboutWindow.on("closed", () => {
    aboutWindow = null;
  });
}

export { showAboutWindow };
