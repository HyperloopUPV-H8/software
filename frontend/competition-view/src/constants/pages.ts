import { Layout, Wrench } from "@workspace/ui/icons";

export const PAGES = {
  "/":          { title: "Dashboard",  icon: Layout },
  "/batteries": { title: "Batteries",  icon: Wrench },
} as const;

export const PAGES_ARRAY = Object.entries(PAGES).map(
  ([url, { title, icon }]) => ({ title, icon, url }),
);
