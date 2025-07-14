import type { DocsflyConfig } from './packages/docsfly/src/types';

const config: DocsflyConfig = {
  site: {
    name: 'Docsfly',
    description: 'Beautiful documentation made simple',
    url: 'https://docsfly.dev',
  },
  docs: {
    dir: 'docs',
    baseUrl: '/docs',
    sidebar: {
      title: 'Documentation',
      collapsible: true,
      autoSort: true,
    },
  },
  // Version functionality
  versions: {
    enabled: true,
    defaultVersion: 'v2',
    versions: [
      {
        name: 'v2',
        label: 'v2.0 (Latest)',
        dir: 'docs',
        isDefault: true,
      },
      {
        name: 'v1',
        label: 'v1.x',
        dir: 'docs-v1',
      },
    ],
  },
  // Blog functionality
  blog: {
    enabled: true,
    dir: 'blog',
    baseUrl: '/blog',
    title: 'Docsfly Blog',
    description: 'Latest updates, tutorials, and announcements',
    postsPerPage: 10,
    authors: {
      'team': {
        name: 'Docsfly Team',
        title: 'Core Team',
        url: 'https://docsfly.dev',
        image_url: '/avatar-team.png',
      },
      'john': {
        name: 'John Doe',
        title: 'Developer',
        url: 'https://github.com/johndoe',
        image_url: '/avatar-john.png',
      },
    },
  },
  theme: {
    defaultTheme: 'light',
    toggleEnabled: true,
    colors: {
      primary: 'oklch(0.45 0.3 260)',
      secondary: 'oklch(0.9 0.02 260)',
    },
  },
  navigation: {
    logo: {
      text: 'Docsfly',
      href: '/',
    },
    links: [
      {
        text: 'Documentation',
        href: '/docs',
      },
      {
        text: 'Blog',
        href: '/blog',
      },
      {
        text: 'GitHub',
        href: 'https://github.com/docsflyapp/docsfly',
        external: true,
      },
    ],
  },
  mdx: {
    components: {
      callout: true,
      codeBlock: true,
      tabs: true,
    },
    plugins: [],
  },
};

export default config;