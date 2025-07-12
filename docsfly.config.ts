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