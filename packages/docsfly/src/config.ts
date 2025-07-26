import { DocsflyConfig } from "./types";

let config: DocsflyConfig | null = null;

export function clearConfigCache(): void {
  config = null;
  // Clear require cache for config files to enable hot reload
  if (typeof require !== 'undefined' && require.cache) {
    const path = require('path');
    const configPaths = [
      path.resolve(process.cwd(), "docsfly.config.js"),
      path.resolve(process.cwd(), "docsfly.config.ts"),
    ];
    
    configPaths.forEach(configPath => {
      if (require.cache[configPath]) {
        delete require.cache[configPath];
      }
    });
  }
}

export function loadConfig(forceReload: boolean = false): DocsflyConfig {
  if (config && !forceReload) {
    return config;
  }
  
  if (forceReload) {
    clearConfigCache();
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
          // For TypeScript files, try to require directly first (works if ts-node is available)
          if (configPath.endsWith('.ts')) {
            try {
              // First try direct require (works with ts-node)
              const userConfig = require(path.resolve(configPath));
              const configExport = userConfig.default || userConfig;
              config = mergeWithDefaults(configExport);
              return config;
            } catch (requireError) {
              // If direct require fails, try transpilation
              try {
                const tsConfig = {
                  module: ts.ModuleKind.CommonJS,
                  target: ts.ScriptTarget.ES2020,
                  moduleResolution: ts.ModuleResolutionKind.NodeJs,
                  allowJs: true,
                  esModuleInterop: true,
                  allowSyntheticDefaultImports: true,
                };

                const result = ts.transpileModule(fs.readFileSync(configPath, 'utf8'), {
                  compilerOptions: tsConfig,
                });

                // Create a temporary module context to evaluate the transpiled code
                const moduleObj = { exports: {} as any };
                const moduleCode = `
                  (function(module, exports, require) {
                    ${result.outputText}
                  })
                `;
                
                eval(moduleCode)(moduleObj, moduleObj.exports, require);
                const configExport = (moduleObj.exports as any).default || moduleObj.exports;
                config = mergeWithDefaults(configExport);
                return config;
              } catch (transpileError) {
                console.warn(`Failed to load TypeScript config ${configPath}:`, transpileError);
                continue;
              }
            }
          }
          
          // For JavaScript files
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
          href: "https://github.com/usedocsfly/docsfly",
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

export function getConfig(forceReload: boolean = false): DocsflyConfig {
  // In development mode, always reload to enable hot reload
  const isDev = process.env.NODE_ENV === 'development';
  return loadConfig(forceReload || isDev);
}
