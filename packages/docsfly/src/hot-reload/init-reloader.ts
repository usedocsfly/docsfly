import { initializeHotReload } from "../docs";

export function InitHotReloader() {
  if (typeof window !== "undefined") return;

  initializeHotReload();
}