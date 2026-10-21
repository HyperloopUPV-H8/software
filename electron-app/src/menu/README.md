# Menu (`menu/`)

Application menu system for the Electron application. Provides the native menu bar with keyboard shortcuts and access to application features.

## Overview

Creates native menus for the main window, backend logs, and About window. The mode selector keeps its original File menu. Menu actions such as reload, fullscreen, and DevTools operate on the window that invoked them.

## Files

- `menu.js` - Menu template definition and creation

## Menu Structure

### Control Station Menu

- **Reload** (`CmdOrCtrl+R`) - Reloads the focused window
- **Testing View**, **Competition View**, **Flashing View**, **Logging View**, **ADJ Viewer** - Switches directly to the chosen mode, stopping the previous services and starting those required by the destination. Only views included in the build are listed.
- **Return to Selector** (`CmdOrCtrl+Shift+S`) - Stops services and returns to the mode selector
- **Quit** (`CmdOrCtrl+Q`) - Quits the application

The selector retains **File > Reload / Return to Selector / Exit**, with Return to Selector disabled to prevent opening another selector.

### Tools Menu

- **Zoom In** (`CmdOrCtrl+Plus`) - Increases zoom of the focused window
- **Zoom Out** (`CmdOrCtrl+-`) - Decreases zoom of the focused window
- **Reset Zoom** (`CmdOrCtrl+0`) - Restores the focused window to 100% zoom
- **Toggle Full Screen** (`F11`) - Toggles fullscreen on the focused window
- **Toggle DevTools** (`F12`) - Opens/closes Chrome DevTools for the focused window

### Help Menu

- **About** - Displays application information dialog

## Functions

### `createMenu({ isSelector = false } = {})`

Builds the Control Station menu, or the original File menu when `isSelector` is true. The default menu is installed during application initialization.

### `setWindowMenu(window, options)`

Assigns a window's menu on Windows/Linux. On macOS, updates the application menu when that window gains focus.

## Dependencies

- `electron` - For Menu, BrowserWindow, dialog, and app APIs

## Used By

- **`app/initialization.js`** - Sets the application-wide menu during app initialization

## Notes

- Keyboard shortcuts automatically use `Cmd` on macOS and `Ctrl` on Windows/Linux
- Menu appears in system menu bar on macOS, in window on Windows/Linux
- Menu items resolve their target window at click time (focused window), so no window reference is needed when building the menu

## See Also

- [../windows/README.md](../windows/README.md) - Window management
