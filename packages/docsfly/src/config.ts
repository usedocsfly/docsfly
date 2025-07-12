import { DocsflyConfig } from './types';

let config: DocsflyConfig | null = null;

export function loadConfig(): DocsflyConfig {
  if (config) {
    return config;
  }

  // Only try to load config on server side
  if (typeof window === 'undefined') {
    try {
      const path = require('path');
      const fs = require('fs');
      
      const configPath = path.join('docsfly.config.ts')
      
      if (fs.existsSync(configPath)) {
        import(configPath).then(mod => {
          const userConfig = mod.default || mod;
          config = mergeWithDefaults(userConfig);
        });
      }
    } catch (error) {
      console.warn('Error loading docsfly.config.ts:', error);
    }
  }

  // Fallback to defaults
  config = getDefaultConfig();
  return config;
}

function mergeWithDefaults(userConfig: Partial<DocsflyConfig>): DocsflyConfig {
  const defaults = getDefaultConfig();
  
  return {
    ...defaults,
    ...userConfig,
    site: {
      ...defaults.site,
      ...userConfig.site,
    },
    docs: {
      ...defaults.docs,
      ...userConfig.docs,
      sidebar: {
        ...defaults.docs.sidebar,
        ...userConfig.docs?.sidebar,
      },
    },
    theme: {
      ...defaults.theme,
      ...userConfig.theme,
      colors: {
        ...defaults.theme?.colors,
        ...userConfig.theme?.colors,
      },
    },
    navigation: {
      ...defaults.navigation,
      ...userConfig.navigation,
      logo: {
        ...defaults.navigation?.logo,
        ...userConfig.navigation?.logo,
      },
    },
    mdx: {
      ...defaults.mdx,
      ...userConfig.mdx,
      components: {
        ...defaults.mdx?.components,
        ...userConfig.mdx?.components,
      },
    },
  };
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
      compact: false,
      sidebar: {
        title: 'Documentation',
        collapsible: true,
        autoSort: true,
      },
    },
    header: {
      title: 'Docsfly',
      navigation: [
        {
          label: 'Home',
          href: '/',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/docsflyapp/docsfly',
        }
      ],
      showSearch: true
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