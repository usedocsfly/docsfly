"use client";

import React, { useState } from 'react';
import { DocNavItem } from '../types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


interface NavigationItemProps {
  item: DocNavItem;
  depth?: number;
}

export function NavigationItem({ item, depth = 0 }: NavigationItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href.replace("#", "");
  const hasChildren = item.children && item.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(() => {
    if (!hasChildren) return false;
    
    // If current path matches any child, expand regardless of collapsed setting
    const hasActiveChild = item.children?.some(child => pathname.startsWith(child.href.replace("#", "")));
    if (hasActiveChild) return true;
    
    // Otherwise use the collapsed setting from _category.json (default to false if not set)
    return item.collapsed !== true;
  });

  const toggleExpanded = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? "bg-secondary text-secondary-foreground"
              : depth > 0
              ? "hover:bg-secondary/80 hover:text-secondary-foreground"
              : "hover:bg-accent/50 hover:text-accent-foreground"
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <button
            onClick={toggleExpanded}
            className={`p-1 mx-1 rounded text-xs transition-transform ${depth > 0 ? "mr-4" : ""}`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
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