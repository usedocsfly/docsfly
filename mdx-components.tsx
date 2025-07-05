import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/callout';
import { CodeBlock, InlineCode } from '@/components/code-block';
import { Tabs } from '@/components/tabs';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-medium mb-6 text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-medium mb-4 mt-8 text-foreground/95">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium mb-3 mt-6 text-foreground/90">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-foreground/95">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 pl-6 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 pl-6 space-y-2 list-decimal">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="list-disc text-foreground/95">{children}</li>
    ),
    code: ({ children }) => (
      <InlineCode>{children}</InlineCode>
    ),
    pre: ({ children }) => (
      <CodeBlock>{children}</CodeBlock>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-4 text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
        {children}
      </a>
    ),
    Callout,
    CodeBlock,
    InlineCode,
    Tabs,
    ...components,
  };
}