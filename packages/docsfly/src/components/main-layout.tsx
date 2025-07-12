"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { ThemeProvider } from "./ui/theme-provider";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />
        {children}
      </div>
    </ThemeProvider>
  );
}
