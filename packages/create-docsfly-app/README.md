# create-docsfly-app

Create a new Docsfly documentation app with shadcn/ui and Next.js App Router.

## Quick Start

```bash
# Create a new app
npx create-docsfly-app@latest my-docs

# Or with bun
bunx create-docsfly-app@latest my-docs

# Navigate to the project
cd my-docs

# Start development server
bun run dev
```

## Usage

```bash
create-docsfly-app [project-directory] [options]
```

### Options

- `-t, --template <template>` - Template to use (default: "default")
- `--skip-install` - Skip package installation
- `--skip-git` - Skip git initialization
- `-h, --help` - Display help information
- `-V, --version` - Display version number

### Examples

```bash
# Create with default template
create-docsfly-app my-docs

# Create with custom template
create-docsfly-app my-docs -t custom

# Skip automatic installation
create-docsfly-app my-docs --skip-install

# Skip git initialization
create-docsfly-app my-docs --skip-git
```

## What's Included

The generated project includes:

- **Next.js 15** with App Router
- **shadcn/ui** components pre-configured
- **Tailwind CSS** for styling
- **TypeScript** support
- **MDX** for documentation
- **Docsfly** framework integration
- **Dark mode** support
- **Sample documentation** files

## Project Structure

```
my-docs/
├── app/
│   ├── docs/
│   │   ├── [[...slug]]/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── docs/
│   ├── getting-started.mdx
│   └── mdx-features.mdx
├── lib/
│   └── utils.ts
├── docsfly.config.ts
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

After creating your app:

1. **Start the development server:**
   ```bash
   bun run dev
   ```

2. **Create your first documentation page:**
   ```bash
   # Create a new MDX file in docs/
   touch docs/my-first-page.mdx
   ```

3. **Customize your site:**
   - Edit `docsfly.config.ts` for site configuration
   - Modify `app/layout.tsx` for global layout changes
   - Update `app/globals.css` for custom styles

## Templates

Currently available templates:

- `default` - Basic Docsfly setup with shadcn/ui

## Requirements

- Node.js 18+ or Bun
- Git (for repository initialization)

## Contributing

See the main [Docsfly repository](https://github.com/docsflyapp/docsfly) for contribution guidelines.

## License

MIT