# Docsfly

Beautiful documentation framework built with Next.js and MDX.

## Features

- 🚀 **Fast**: Built with Next.js 15 and Turbopack
- 📝 **MDX**: Write content with React components
- 🎨 **Beautiful**: Modern design with Tailwind CSS
- 🌙 **Dark Mode**: Built-in theme toggle
- 📱 **Responsive**: Mobile-first design
- 🔧 **Configurable**: Flexible configuration system
- 🎯 **TypeScript**: Full type safety

## Installation

```bash
npm install docsfly
# or
yarn add docsfly
# or
pnpm add docsfly
```

## Quick Start

1. Create a `docsfly.config.ts` file in your project root:

```typescript
import type { DocsflyConfig } from 'docsfly';

const config: DocsflyConfig = {
  site: {
    name: 'My Docs',
    description: 'My awesome documentation',
  },
  docs: {
    dir: 'docs',
    baseUrl: '/docs',
  },
};

export default config;
```

2. Create your MDX files in the `docs` directory:

```mdx
---
title: Getting Started
description: Learn how to use Docsfly
order: 1
---

# Getting Started

Welcome to Docsfly!
```

3. Use the provided functions in your Next.js app:

```typescript
import { getAllDocs, generateNavigation } from 'docsfly';

export default async function DocsPage() {
  const docs = await getAllDocs();
  const navigation = await generateNavigation();
  
  return (
    // Your component JSX
  );
}
```

## Configuration

The `docsfly.config.ts` file supports the following options:

### Site Configuration

```typescript
site: {
  name: string;           // Site name
  description?: string;   // Site description
  url?: string;          // Site URL
  favicon?: string;      // Path to favicon
}
```

### Docs Configuration

```typescript
docs: {
  dir: string;           // Directory containing MDX files
  baseUrl?: string;      // Base URL for docs routes
  sidebar?: {
    title?: string;      // Sidebar title
    collapsible?: boolean; // Enable collapsible sections
    autoSort?: boolean;  // Auto-sort navigation items
  };
}
```

### Theme Configuration

```typescript
theme?: {
  defaultTheme?: 'light' | 'dark' | 'system';
  toggleEnabled?: boolean;
  colors?: {
    primary?: string;    // Primary color (CSS custom property)
    secondary?: string;  // Secondary color
    accent?: string;     // Accent color
    background?: string; // Background color
    foreground?: string; // Foreground color
  };
}
```

### Navigation Configuration

```typescript
navigation?: {
  logo?: {
    text?: string;       // Logo text
    href?: string;       // Logo link
    image?: string;      // Logo image path
  };
  links?: Array<{
    text: string;        // Link text
    href: string;        // Link URL
    external?: boolean;  // External link flag
  }>;
}
```

### MDX Configuration

```typescript
mdx?: {
  components?: {
    callout?: boolean;   // Enable Callout component
    codeBlock?: boolean; // Enable CodeBlock component
    tabs?: boolean;      // Enable Tabs component
  };
  plugins?: Array<any>; // MDX plugins
}
```

## Components

Docsfly provides several React components for building documentation UIs:

### `DocsLayout`

Main layout component with sidebar navigation.

```typescript
<DocsLayout navigation={navigation}>
  {children}
</DocsLayout>
```

### `DocsPage`

Individual documentation page wrapper with metadata.

```typescript
<DocsPage
  title="Getting Started"
  description="Learn how to use Docsfly"
  lastUpdated="2024-01-01"
  tags={["guide", "setup"]}
>
  {content}
</DocsPage>
```

### `Sidebar`

Standalone sidebar component with navigation.

```typescript
<Sidebar navigation={navigation} />
```

### `DocsListing`

Component for displaying a list of documentation pages.

```typescript
<DocsListing
  docs={docs}
  showDescription={true}
  showTags={true}
  showDate={true}
  groupByCategory={true}
/>
```

### `Search`

Search component for documentation.

```typescript
<Search
  docs={docs}
  onSelect={(doc) => console.log(doc)}
  placeholder="Search documentation..."
/>
```

## API Reference

### `getAllDocs(): Promise<Doc[]>`

Returns all documentation files with metadata.

### `getDocBySlug(slug: string): Promise<Doc | null>`

Returns a specific document by its slug.

### `generateNavigation(): Promise<DocNavItem[]>`

Generates navigation structure from documentation files.

### `getConfig(): DocsflyConfig`

Returns the current configuration.

## Types

```typescript
interface Doc {
  slug: string;
  meta: DocMeta;
  content: string;
  path: string;
}

interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
}

interface DocNavItem {
  title: string;
  href: string;
  children?: DocNavItem[];
}
```

## License

MIT © Docsfly Team