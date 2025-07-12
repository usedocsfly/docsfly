import type { MDXComponents } from 'mdx/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'docsfly';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    ...components,
  };
}