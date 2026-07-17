/**
 * @module menu
 * @description Application menu creation and management for the Electron application.
 * Defines menu structure with File, Tools, and Help sections with keyboard shortcuts and actions.
 */

import { BrowserWindow, Menu, app, dialog } from "electron";

/**
 * Creates the application menu with File, Tools, and Help sections.
 * Includes menu items for reloading, exiting, toggling fullscreen/DevTools, and app information.
 * Menu actions operate on the currently focused window, so the menu can be
 * shared by all windows via Menu.setApplicationMenu.
 * View switching is no longer available since the mode is selected at startup.
 * @returns {Menu} The built application menu.
 * @example
 * Menu.setApplicationMenu(createMenu());
 */
function createMenu() {
  const template = [
    {
      label: "File",
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
        {
          label: "Return to Selector",
          accelerator: "CmdOrCtrl+Shift+S",
          click: () => app.emit("return-to-selector"),
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "Tools",
      submenu: [
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
          click: () => {
            dialog.showMessageBox(BrowserWindow.getFocusedWindow() ?? undefined, {
              type: "info",
              title: "About",
              message: "Hyperloop UPV Control Station",
              detail: `Version ${app.getVersion()}\n\nControl and monitoring software for Hyperloop pod.`,
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  return menu;
}

export { createMenu };
