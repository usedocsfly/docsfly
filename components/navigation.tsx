"use client";

import Link from "next/link";
import type { DocNavItem } from "@/lib/docs";
import { usePathname } from "next/navigation";

interface NavigationProps {
  items: DocNavItem[];
}

export function Navigation({ items }: NavigationProps) {
  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <NavigationItem
          key={item.href + item.title.replace(/\s+/g, "-").toLowerCase()}
          item={item}
        />
      ))}
    </nav>
  );
}

interface NavigationItemProps {
  item: DocNavItem;
  depth?: number;
}

function NavigationItem({ item, depth = 0 }: NavigationItemProps) {
  const isActive = usePathname() === item.href.replace("#", "");
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <Link
        href={item.href}
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-secondary text-secondary-foreground"
            : depth > 0
            ? "hover:bg-secondary/80 hover:text-secondary-foreground"
            : "hover:bg-accent/50 hover:text-accent-foreground"
        } ${depth > 0 ? "ml-4" : ""}`}
      >
        {item.title}
      </Link>
      {hasChildren && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavigationItem
              key={child.href}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
