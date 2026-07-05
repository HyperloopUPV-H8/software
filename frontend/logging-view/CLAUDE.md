# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server on port 9003
pnpm build        # tsc -b && vite build
pnpm lint         # ESLint
pnpm preview      # Preview production build
```

Run from the monorepo root targeting this workspace:

```bash
pnpm dev --filter logging-view
pnpm add <package> --filter logging-view
```

> **pnpm only** — the `preinstall` hook enforces this via `only-allow`.

## Architecture

`logging-view` is one of several frontend workspaces in the monorepo (`frontend/`). It shares infrastructure with `competition-view` and `testing-view` but is a standalone Vite+React app running on its own port.

**Current status: scaffold, not yet wired up.** The store slices, types, and layout shell were carried over from `competition-view`, but `App.tsx` doesn't yet subscribe to any topics or define routes, and some sidebar components (`ConnectionStatusGroup`, `KeyboardShortcutsHelp`) import from `../hooks/useConnections` and `../hooks/useKeyboardShortcuts`, which don't exist in this workspace yet — check `competition-view/src` for the reference implementation before assuming a missing import is a bug.

### Workspace dependencies

| Package | Alias | What it provides |
|---|---|---|
| `frontend-kit/ui` | `@workspace/ui` | shadcn/Radix UI components, custom hooks (`useWebSocket`, `useTopic`), Lucide icons |
| `frontend-kit/core` | `@workspace/core` | WebSocket utilities, `socketService`, shared business logic |

Import components from the shared packages:

```tsx
import { Button, Sidebar } from "@workspace/ui/components";
import { Plus } from "@workspace/ui/icons";
import { socketService } from "@workspace/core";
```

### State management

Single Zustand store composed of slices (`src/store/`). Only `isDarkMode` is persisted (localStorage key `competition-view-storage`). All other state is ephemeral.

| Slice | Purpose |
|---|---|
| `appSlice` | Dark mode toggle |
| `connectionsSlice` | WebSocket connection statuses (`Record<string, Connection>`) |
| `messagesSlice` | Incoming log messages, capped at 500 entries (newest first) |
| `telemetrySlice` | Flat map of latest measurement values, flattened from `TelemetryData` packets |
| `catalogSlice` | Commands catalog fetched from backend (`GET /backend/orderStructures`) |

### WebSocket integration

Use hooks from `@workspace/core`/`@workspace/ui`:

```tsx
import { useTopic, useWebSocket } from "@workspace/ui/hooks";

const { isConnected } = useWebSocket();

useTopic<TelemetryData>("podData/update", (data) => {
  updateTelemetry(data);
});

socketService.post("order/send", payload);
```

Relevant topics: `podData/update`, `connection/update`, `message/update`.

### Layout structure

`AppLayout` (sidebar + header shell) wraps all page content. The sidebar is collapsible-to-icon and has dark mode toggle in the footer. Pages/views go inside the `children` slot.

### Adding icons

1. Find the icon on lucide.dev — note its **first category**.
2. Add the export to the matching category file in `frontend-kit/ui/src/icons/`.
3. Re-export from `index.ts` if the category file is new.