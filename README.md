# Docsfly

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/docsflyapp/docsfly?utm_source=oss&utm_medium=github&utm_campaign=docsflyapp%2Fdocsfly&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

A modern documentation framework built with Next.js 15, MDX, and Tailwind CSS.

## Monorepo Structure

```
docsfly/
├── apps/
│   └── docs/           # Sample documentation app
├── packages/
│   └── create-docsfly-app/  # CLI tool for creating new apps
├── package.json
└── turbo.json
```

## Quick Start

Create a new Docsfly app:

```bash
npx create-docsfly-app my-docs-site
cd my-docs-site
bun install
bun run dev
```

## Development

This monorepo uses Turborepo for efficient builds and development.

```bash
# Install dependencies
bun install

# Run all apps in development
bun run dev

# Build all packages
bun run build

# Run tests
bun run test

# Lint all packages
bun run lint
```

## Features

- 📝 Write docs in MDX with React components
- 🎨 Beautiful, responsive design
- 🌙 Dark mode support
- 🔍 Auto-generated navigation
- ⚡ Fast builds with Next.js 15
- 🎯 TypeScript support
- 🎪 40+ UI components included
- 🏗️ Monorepo structure with Turborepo

## Packages

- **create-docsfly-app**: CLI tool for creating new Docsfly apps
- **docs**: Sample documentation app

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Turborepo](https://turbo.build/)