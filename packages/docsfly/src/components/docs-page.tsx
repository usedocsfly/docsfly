"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { MDXProvider } from "@mdx-js/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface DocsPageProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  lastUpdated?: string;
  tags?: string[];
  className?: string;
}

const markdownComponents = {
  h1: ({ children, ...props }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-bold mb-6" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl font-semibold text-foreground/95 mb-4" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-medium text-foreground/90 mb-3" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: { children?: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed" {...props}>{children}</p>
  ),
  pre: ({ children, ...props }: { children?: React.ReactNode }) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: { children?: React.ReactNode }) => (
    <code className="bg-muted px-2 py-1 rounded mb-4" {...props}>{children}</code>
  ),
  ul: ({ children, ...props }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: { children?: React.ReactNode }) => (
    <li className="mb-1" {...props}>{children}</li>
  ),
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};

export function DocsPage({
  children,
  title,
  description,
  lastUpdated,
  tags,
  className = "",
}: DocsPageProps) {
  return (
    <article className={`max-w-none ${className}`}>
      {title && (
        <header className="mb-8 pb-6 border-b border-border">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
          {description && (
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {lastUpdated && (
              <span className="flex items-center gap-1">
                📅 Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </span>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
      )}
      <div className="prose dark:prose-invert text-foreground leading-7 [&>*]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-3 [&>p]:mb-4 [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>ul]:pl-6 [&>ol]:pl-6 [&>li]:mb-1">
        <MDXProvider components={markdownComponents}>
          {typeof children === 'string' ? (
            <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
          ) : (
            children
          )}
        </MDXProvider>
      </div>
    </article>
  );
}
