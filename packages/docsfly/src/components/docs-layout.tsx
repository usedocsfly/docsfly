'use client';

import React, { ReactNode } from 'react';
import { DocNavItem } from '../types';
import { Sidebar } from './sidebar';

interface DocsLayoutProps {
  children: ReactNode;
  navigation: DocNavItem[];
  className?: string;
}

export function DocsLayout({ children, navigation, className = '' }: DocsLayoutProps) {
  
  return (
    <div className={`flex min-h-screen ${className}`}>
      <Sidebar navigation={navigation} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}

interface DocsPageProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  lastUpdated?: string;
  tags?: string[];
  className?: string;
}

export function DocsPage({ 
  children, 
  title, 
  description, 
  lastUpdated, 
  tags,
  className = '' 
}: DocsPageProps) {
  return (
    <article className={`prose prose-slate max-w-none dark:prose-invert ${className}`}>
      {title && (
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-muted-foreground mb-4">{description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {lastUpdated && (
              <span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
      )}
      <div className="doc-content">
        {children}
      </div>
    </article>
  );
}