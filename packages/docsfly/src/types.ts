import type { SerializeResult } from 'next-mdx-remote-client/serialize';

export interface DocsflyConfig {
  site: {
    name: string;
    description?: string;
    url?: string;
    favicon?: string;
  };
  docs: {
    dir: string;
    baseUrl?: string;
    compact?: boolean;
    sidebar?: {
      title?: string;
      collapsible?: boolean;
      autoSort?: boolean;
    };
  };
  versions?: {
    enabled: boolean;
    defaultVersion?: string;
    versions: Array<{
      name: string;
      label: string;
      dir: string;
      isDefault?: boolean;
    }>;
  };
  blog?: {
    enabled: boolean;
    dir: string;
    baseUrl?: string;
    title?: string;
    description?: string;
    postsPerPage?: number;
    authors?: Record<string, {
      name: string;
      title?: string;
      url?: string;
      image_url?: string;
    }>;
  };
  header?: {
    title?: string;
    logo?: string;
    navigation?: Array<{
      label: string;
      href: string;
    }>;
    showSearch?: boolean;
  };
  theme?: {
    defaultTheme?: "light" | "dark" | "system";
    toggleEnabled?: boolean;
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      foreground?: string;
    };
  };
  navigation?: {
    logo?: {
      text?: string;
      href?: string;
      image?: string;
    };
    links?: Array<{
      text: string;
      href: string;
      external?: boolean;
    }>;
  };
  mdx?: {
    components?: {
      callout?: boolean;
      codeBlock?: boolean;
      tabs?: boolean;
    };
    plugins?: Array<any>;
  };
}

export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
}

export interface BlogMeta {
  title: string;
  description?: string;
  author?: string;
  date: string;
  tags?: string[];
  draft?: boolean;
  featured?: boolean;
  image?: string;
}

export interface Doc {
  slug: string;
  meta: DocMeta;
  content: SerializeResult;
  path: string;
  version?: string;
}

export interface BlogPost {
  slug: string;
  meta: BlogMeta;
  content: SerializeResult;
  path: string;
  excerpt?: string;
}

export interface DocNavItem {
  title: string;
  href: string;
  children?: DocNavItem[];
  order?: number;
  collapsed?: boolean;
}

export interface CategoryConfig {
  name: string;
  order?: number;
  description?: string;
  collapsed?: boolean;
}
