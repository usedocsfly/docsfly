# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Docsfly is a modern documentation framework built with Next.js 15, MDX, and Tailwind CSS. It creates beautiful, interactive documentation websites with file-based routing where MDX files in `/docs` become routes with automatic navigation generation.

## Development Commands

Use Bun as the primary runtime:

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build production application  
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Architecture

### Core Stack
- **Next.js 15** with App Router
- **MDX** for content with React component integration
- **Tailwind CSS v4** with CSS variables and OKLCH colors
- **Radix UI** components via shadcn/ui pattern
- **TypeScript** for type safety

### Directory Structure
- `app/` - Next.js App Router with docs routes under `app/docs/[...slug]`
- `docs/` - MDX documentation files that become routes
- `components/ui/` - shadcn/ui components (40+ components)
- `components/` - Custom components (callout, code-block, navigation, tabs, theme-toggle)
- `lib/` - Utilities including docs processing and theme provider
- `hooks/` - Custom React hooks

### MDX Integration
- MDX files support YAML frontmatter with `title`, `description`, `order`, `category`, `tags`
- Custom components available in MDX: `<Callout>`, `<CodeBlock>`, `<Tabs>`
- Navigation automatically generated from MDX metadata and file structure
- File-based routing: `/docs/getting-started.mdx` becomes `/docs/getting-started`

### Theme System
- CSS variables for theming in `app/globals.css`
- Dark/light mode toggle via `next-themes`
- OKLCH color space for modern color handling
- Responsive design with mobile-first approach

### Component Patterns
- Use `components/ui/` for Radix UI primitives
- Use `class-variance-authority` for component variants
- All components use `cn()` utility from `lib/utils.ts` for className merging
- Theme-aware components with CSS variable integration

## Key Files

- `app/docs/layout.tsx` - Docs layout with sidebar navigation
- `lib/docs.ts` - Documentation file processing and metadata extraction
- `lib/theme-provider.tsx` - Theme context provider
- `components/navigation.tsx` - Sidebar navigation component
- `mdx-components.tsx` - Global MDX component mapping

## Testing

No testing framework currently configured. Use `bun test` for future testing needs.

## Important Notes

- Always use Bun commands instead of npm/yarn
- Follow existing component patterns in `components/ui/`
- MDX files require frontmatter for proper navigation
- Use CSS variables for consistent theming
- All UI components are accessible via Radix UI primitives