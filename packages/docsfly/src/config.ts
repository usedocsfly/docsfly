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

    const configPath = path.join("docsfly.config.ts");

    if (fs.existsSync(configPath)) {
      try {
        const userConfig = require(configPath);
        config = mergeWithDefaults(userConfig);
        return config;
      } catch (error) {
        console.warn("Error loading docsfly.config.ts:", error);
      }
    } else {
      config = getDefaultConfig();
      return config;
    }
  } catch (error) {
    console.warn("Error loading docsfly.config.ts:", error);
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
