# Menu (`menu/`)

Application menu system for the Electron application. Provides the native menu bar with keyboard shortcuts and access to application features.

## Overview

Creates the native application menu bar shared by all windows. Menu actions operate on the currently focused window, so shortcuts like fullscreen and DevTools work in the main window, the mode selector, and the log window alike.

## Files

- `menu.js` - Menu template definition and creation

## Menu Structure

### File Menu

- **Reload** (`CmdOrCtrl+R`) - Reloads the focused window
- **Return to Selector** (`CmdOrCtrl+Shift+S`) - Stops services and returns to the mode selector
- **Exit** (`CmdOrCtrl+Q`) - Quits the application

### Tools Menu

- **Toggle Full Screen** (`F11`) - Toggles fullscreen on the focused window
- **Toggle DevTools** (`F12`) - Opens/closes Chrome DevTools for the focused window

### Help Menu

- **About** - Displays application information dialog

## Functions

### `createMenu()`

Builds and returns the application menu. Set it globally with `Menu.setApplicationMenu(createMenu())` so it applies to every window.

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
