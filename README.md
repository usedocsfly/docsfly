# Docsfly

A modern documentation framework built with Next.js 15, MDX, and Tailwind CSS. Create beautiful, interactive documentation websites with file-based routing and automatic navigation generation.

## Features

- **🚀 Next.js 15** - Built on the latest Next.js with App Router for optimal performance
- **📝 MDX Integration** - Write content in Markdown with React components
- **🎨 Modern Styling** - Tailwind CSS v4 with CSS variables and OKLCH colors
- **🌙 Dark/Light Theme** - Built-in theme switching with persistence
- **📱 Responsive Design** - Mobile-first approach with seamless mobile experience
- **🎯 TypeScript** - Full type safety throughout the codebase
- **⚡ Bun Runtime** - Optimized for Bun for faster development and builds
- **🔧 40+ Components** - Comprehensive UI component library via shadcn/ui
- **🧭 Auto Navigation** - Generated from file structure and frontmatter metadata
- **🎪 Interactive Components** - Callouts, code blocks, tabs, and more

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd docsfly

# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:3000` to see your documentation site.

## Project Structure

```
docsfly/
├── app/                    # Next.js App Router
│   ├── docs/              # Documentation routes
│   │   ├── [...slug]/     # Dynamic doc pages
│   │   └── layout.tsx     # Docs layout with navigation
│   ├── globals.css        # Global styles with CSS variables
│   └── layout.tsx         # Root layout with theme provider
├── components/            # React components
│   ├── ui/               # shadcn/ui components (40+ components)
│   ├── callout.tsx       # Documentation callout component
│   ├── code-block.tsx    # Syntax-highlighted code blocks
│   ├── navigation.tsx    # Sidebar navigation
│   ├── tabs.tsx          # Tabbed content
│   └── theme-toggle.tsx  # Dark/light theme switcher
├── docs/                 # MDX documentation files
│   ├── getting-started.mdx
│   ├── components.mdx
│   └── theming.mdx
├── lib/                  # Utilities
│   ├── docs.ts           # Documentation processing
│   └── utils.ts          # Helper functions
└── hooks/                # Custom React hooks
```

## Writing Documentation

### Creating Pages

Create `.mdx` files in the `docs/` directory. Each file becomes a route:

```markdown
---
title: "Getting Started"
description: "Learn how to get started with Docsfly"
order: 1
category: "Guide"
tags: ["setup", "installation"]
---

# Getting Started

Welcome to Docsfly! This guide will help you get started.

<Callout type="info">
  This is an info callout with helpful information.
</Callout>
```

### Available Components

Use these components in your MDX files:

#### Callout

```mdx
<Callout type="info">
  Important information for users.
</Callout>

<Callout type="warning">
  Warning about potential issues.
</Callout>

<Callout type="error">
  Error information or critical warnings.
</Callout>
```

#### Code Block

```mdx
<CodeBlock filename="example.ts" language="typescript">
  const greeting = "Hello, World!";
  console.log(greeting);
</CodeBlock>
```

#### Tabs

```mdx
<Tabs defaultValue="npm">
  <TabsList>
    <TabsTrigger value="npm">npm</TabsTrigger>
    <TabsTrigger value="bun">Bun</TabsTrigger>
  </TabsList>
  <TabsContent value="npm">
    Install with npm: `npm install`
  </TabsContent>
  <TabsContent value="bun">
    Install with Bun: `bun install`
  </TabsContent>
</Tabs>
```

## Development

### Available Commands

```bash
# Development server with hot reloading
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Lint code
bun run lint
```

### Adding Components

1. Create components in `components/ui/` following the shadcn/ui pattern
2. Use the `cn()` utility for className merging
3. Support both light and dark themes using CSS variables
4. Make components available in MDX via `mdx-components.tsx`

### Theming

The project uses CSS variables for theming. Customize colors in `app/globals.css`:

```css
:root {
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  /* ... more variables */
}

[data-theme="dark"] {
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  /* ... more variables */
}
```

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Content:** MDX with React components
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Syntax Highlighting:** React Shiki
- **Theme Management:** next-themes
- **Runtime:** Bun (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run lint` to check for issues
5. Submit a pull request

## License

MIT License - see LICENSE file for details.