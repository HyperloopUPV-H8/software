/**
 * @module menu
 * @description Application menu creation and management for the Electron application.
 * Defines window menus and shortcuts for navigating the Control Station.
 */

import { BrowserWindow, Menu, app } from "electron";
import fs from "fs";
import path from "path";
import { getAppPath } from "../utils/paths.js";
import { showAboutWindow } from "../windows/aboutWindow.js";
import { getCurrentView } from "../windows/mainWindow.js";

/**
 * Creates the Control Station menu, or the original File menu for the selector.
 * Only views included in the installed build are offered as destinations.
 * @returns {Menu} The built application menu.
 * @example
 * Menu.setApplicationMenu(createMenu());
 */
function createMenu({ isSelector = false } = {}) {
  const views = [
    { mode: "testing", label: "Testing View" },
    { mode: "competition", label: "Competition View" },
    { mode: "flashing", label: "Flashing View" },
    { mode: "logging", label: "Logging View" },
    { mode: "adj", label: "ADJ Viewer" },
  ];
  const viewItems = isSelector
    ? []
    : views
        .filter(({ mode }) =>
          fs.existsSync(
            path.join(getAppPath(), "renderer", `${mode}-view`, "index.html"),
          ),
        )
        .map(({ mode, label }) => ({
          label,
          click: () => app.emit("switch-mode", mode),
        }));

  const template = [
    {
      label: isSelector ? "File" : "Control Station",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: (_, browserWindow) => {
            if (browserWindow) {
              browserWindow.reload();
            }
          },
        },
        ...(viewItems.length
          ? [{ type: "separator" }, ...viewItems, { type: "separator" }]
          : []),
        {
          label: "Return to Selector",
          accelerator: "CmdOrCtrl+Shift+S",
          enabled: !isSelector,
          click: () => app.emit("return-to-selector"),
        },
        { type: "separator" },
        {
          label: isSelector ? "Exit" : "Quit",
          accelerator: "CmdOrCtrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "Tools",
      submenu: [
        { role: "zoomIn", label: "Zoom In" },
        { role: "zoomOut", label: "Zoom Out" },
        { role: "resetZoom", label: "Reset Zoom" },
        { type: "separator" },
        {
          label: "Toggle Full Screen",
          accelerator: "F11",
          click: (_, browserWindow) => {
            if (browserWindow) {
              browserWindow.setFullScreen(!browserWindow.isFullScreen());
            }
          },
        },
        {
          label: "Toggle DevTools",
          accelerator: "F12",
          click: (_, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          // Only meaningful in logging-view — the About window credits its
          // author specifically, not the Control Station as a whole.
          click: () => {
            if (getCurrentView() !== "logging-view") return;
            showAboutWindow(BrowserWindow.getFocusedWindow());
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  return menu;
}

/** Assign a menu to a window; macOS uses the focused window's application menu. */
function setWindowMenu(window, options) {
  const menu = createMenu(options);
  if (process.platform === "darwin") {
    window.on("focus", () => Menu.setApplicationMenu(menu));
    if (window.isFocused()) Menu.setApplicationMenu(menu);
  } else {
    window.setMenu(menu);
  }
}

export { createMenu, setWindowMenu };
