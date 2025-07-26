import { DocsflyConfig } from "./types";

let config: DocsflyConfig | null = null;

export function loadConfig(): DocsflyConfig {
  if (config) {
    return config;
  }

  // Client-side: always use defaults
  if (typeof window !== "undefined") {
    config = getDefaultConfig();
    return config;
  }

  // Server-side: try to load config file
  try {
    const fs = require("fs");
    const path = require("path");
    const ts = require('typescript');

    // Try both .ts and .js extensions
    const configPaths = [
      path.join("docsfly.config.js"),
      path.join("docsfly.config.ts")
    ];

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        try {
          // For TypeScript files, we need to handle compilation
          if (configPath.endsWith('.ts')) {
            // Try to use ts-node or similar if available
            try {
              const tsConfig = {
                module: 'CommonJS',
                target: 'ES2020',
                moduleResolution: 'node',
                allowJs: true,
                noEmit: true,
              };

              const result = ts.transpileModule(fs.readFileSync(configPath, 'utf8'), {
                compilerOptions: tsConfig,
              });

              const userConfig = JSON.parse(eval(result.outputText));
              config = mergeWithDefaults(userConfig);
              return config;
            } catch (e) {
              // ts-node not available, skip this file
              continue;
            }
          }
          
          const userConfig = require(path.resolve(configPath));
          const configExport = userConfig.default || userConfig;
          config = mergeWithDefaults(configExport);
          return config;
        } catch (error) {
          console.warn(`Error loading ${configPath}:`, error);
          continue;
        }
      }
    }
    
    config = getDefaultConfig();
    return config;
  } catch (error) {
    console.warn("Error loading docsfly.config:", error);
    config = getDefaultConfig();
    return config;
  }

  return config || getDefaultConfig();
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
    versions: userConfig.versions
      ? {
          ...defaults.versions,
          ...userConfig.versions,
        }
      : defaults.versions,
    blog: userConfig.blog
      ? {
          ...defaults.blog,
          ...userConfig.blog,
        }
      : defaults.blog,
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
      name: "Documentation",
      description: "Documentation site built with Docsfly",
    },
    docs: {
      dir: "docs",
      baseUrl: "/docs",
      compact: false,
      sidebar: {
        title: "Documentation",
        collapsible: true,
        autoSort: true,
      },
    },
    versions: {
      enabled: false,
      versions: [],
    },
    blog: {
      enabled: false,
      dir: "blog",
      baseUrl: "/blog",
      title: "Blog",
      description: "Latest updates and announcements",
      postsPerPage: 10,
      authors: {},
    },
    header: {
      title: "Docsfly",
      navigation: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Documentation",
          href: "/docs",
        },
        {
          label: "GitHub",
          href: "https://github.com/docsflyapp/docsfly",
        },
      ],
      showSearch: true,
    },
    theme: {
      defaultTheme: "light",
      toggleEnabled: true,
      colors: {
        primary: "oklch(0.45 0.3 260)",
        secondary: "oklch(0.9 0.02 260)",
      },
    },
    navigation: {
      logo: {
        text: "Docs",
        href: "/",
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
