"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ui/theme-provider";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}