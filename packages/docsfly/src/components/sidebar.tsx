import React from "react";
import { DocNavItem } from "../types";
import { getConfig } from "../config";
import { NavigationItem } from "./navigation";

interface SidebarProps {
  navigation: DocNavItem[];
  className?: string;
}

export function Sidebar({ navigation, className = "" }: SidebarProps) {
  const config = getConfig();

  return (
    <nav className={`space-y-2 w-[240px] ${className}`}>
      <h2 className="px-3 py-2 text-lg font-semibold">
        {config.docs.sidebar?.title || "Documentation"}
      </h2>
      {navigation.map((item) => (
        <NavigationItem
          key={item.href + item.title.replace(/\s+/g, "-").toLowerCase()}
          item={item}
        />
      ))}
    </nav>
  );
}
