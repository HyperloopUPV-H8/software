import { useCallback, useEffect, useState } from "react";
import { AdjViewerPage } from "./components/AdjViewerPage";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("adj-view-dark-mode");
    return saved !== null
      ? saved === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("adj-view-dark-mode", String(isDark));
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return (
    <div className="bg-background text-foreground h-screen w-screen overflow-auto">
      <AdjViewerPage isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
