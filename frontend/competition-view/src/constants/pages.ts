import { Battery, Layout } from "@workspace/ui/icons";

export const PAGES = {
  "/":          { title: "Dashboard",  icon: Layout },
  "/batteries": { title: "Batteries",  icon: Battery },
} as const;

export const PAGES_ARRAY = Object.entries(PAGES).map(
  ([url, { title, icon }]) => ({ title, icon, url }),
);
