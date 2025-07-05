import { DocsflyConfig } from './types';
import path from 'path';

let config: DocsflyConfig | null = null;

export function loadConfig(): DocsflyConfig {
  if (config) {
    return config;
  }

  // Try to load config from project root
  const configPath = path.join(process.cwd(), 'docsfly.config.ts');
  
  try {
    // Dynamic import for TypeScript config
    const configModule = require(configPath);
    config = configModule.default || configModule;
    
    // Apply defaults
    config = {
      ...getDefaultConfig(),
      ...config,
      site: {
        ...getDefaultConfig().site,
        ...config?.site,
      },
      docs: {
        ...getDefaultConfig().docs,
        ...config?.docs,
        sidebar: {
          ...getDefaultConfig().docs.sidebar,
          ...config?.docs?.sidebar,
        },
      },
      theme: {
        ...getDefaultConfig().theme,
        ...config?.theme,
        colors: {
          ...getDefaultConfig().theme?.colors,
          ...config?.theme?.colors,
        },
      },
      navigation: {
        ...getDefaultConfig().navigation,
        ...config?.navigation,
        logo: {
          ...getDefaultConfig().navigation?.logo,
          ...config?.navigation?.logo,
        },
      },
      mdx: {
        ...getDefaultConfig().mdx,
        ...config?.mdx,
        components: {
          ...getDefaultConfig().mdx?.components,
          ...config?.mdx?.components,
        },
      },
    };
    
    return config;
  } catch (error) {
    console.warn('No docsfly.config.ts found or error loading config, using defaults');
    config = getDefaultConfig();
    return config;
  }
}

function getDefaultConfig(): DocsflyConfig {
  return {
    site: {
      name: 'Documentation',
      description: 'Documentation site built with Docsfly',
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
        text: 'Docs',
        href: '/',
      },
      links: [],
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
}

export function getConfig(): DocsflyConfig {
  return loadConfig();
}