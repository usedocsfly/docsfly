"use client";

import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const components = {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
};

interface MDXRendererProps {
  children: React.ReactNode;
}

export function MDXRenderer({ children }: MDXRendererProps) {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
}