'use client';

import React from 'react';
import { DocNavItem } from '../types';
import { getConfig } from '../config';

interface SidebarProps {
  navigation: DocNavItem[];
  className?: string;
}

export function Sidebar({ navigation, className = '' }: SidebarProps) {
  const config = getConfig();
  
  return (
    <aside className={`w-64 min-h-screen bg-background border-r ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {config.docs.sidebar?.title || 'Documentation'}
        </h2>
        <Navigation items={navigation} />
      </div>
    </aside>
  );
}

interface NavigationProps {
  items: DocNavItem[];
}

function Navigation({ items }: NavigationProps) {
  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <NavigationItem
          key={item.href + item.title.replace(/\s+/g, '-').toLowerCase()}
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
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <NavigationLink item={item} depth={depth} />
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

interface NavigationLinkProps {
  item: DocNavItem;
  depth: number;
}

function NavigationLink({ item, depth }: NavigationLinkProps) {
  // Use dynamic import for Next.js components to avoid SSR issues
  const [Link, setLink] = React.useState<any>(null);
  const [usePathname, setUsePathname] = React.useState<any>(null);

  React.useEffect(() => {
    const loadNext = async () => {
      try {
        const nextLink = await import('next/link');
        const nextNavigation = await import('next/navigation');
        setLink(() => nextLink.default);
        setUsePathname(() => nextNavigation.usePathname);
      } catch (error) {
        // Fallback for non-Next.js environments
        console.warn('Next.js not available, using fallback link');
      }
    };
    loadNext();
  }, []);

  const pathname = usePathname ? usePathname() : '';
  const isActive = pathname === item.href.replace('#', '');

  if (!Link) {
    // Fallback for non-Next.js environments
    return (
      <a
        href={item.href}
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-secondary text-secondary-foreground'
            : depth > 0
            ? 'hover:bg-secondary/80 hover:text-secondary-foreground'
            : 'hover:bg-accent/50 hover:text-accent-foreground'
        } ${depth > 0 ? 'ml-4' : ''}`}
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-secondary text-secondary-foreground'
          : depth > 0
          ? 'hover:bg-secondary/80 hover:text-secondary-foreground'
          : 'hover:bg-accent/50 hover:text-accent-foreground'
      } ${depth > 0 ? 'ml-4' : ''}`}
    >
      {item.title}
    </Link>
  );
}