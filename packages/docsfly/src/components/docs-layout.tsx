import { ReactNode } from "react";
import { DocNavItem } from "../types";
import { Sidebar } from "./sidebar";
import { getConfig } from "../config";
import { HotReloader } from "../hot-reload/reloader";
interface DocsLayoutProps {
  children: ReactNode;
  navigation: DocNavItem[];
  className?: string;
}

export function DocsLayout({
  children,
  navigation,
  className = "",
}: DocsLayoutProps) {
  const config = getConfig();

  return (
    <div
      className={`flex flex-1 justify-center overflow-hidden pt-8 ${className}`}
    >
      <div
        className={`flex justify-center max-w-full ${
          config.docs.compact ? "md:max-w-4xl" : "md:max-w-7xl"
        } gap-24 mx-auto w-full h-full`}
      >
        <HotReloader />
        <Sidebar navigation={navigation} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}