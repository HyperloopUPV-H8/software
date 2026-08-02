/// <reference types="vite/client" />

interface ElectronAPI {
  switchView: (view: string, query?: Record<string, string>) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
