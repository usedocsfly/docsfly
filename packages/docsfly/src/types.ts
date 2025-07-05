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
    sidebar?: {
      title?: string;
      collapsible?: boolean;
      autoSort?: boolean;
    };
  };
  theme?: {
    defaultTheme?: 'light' | 'dark' | 'system';
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

export interface Doc {
  slug: string;
  meta: DocMeta;
  content: string;
  path: string;
}

export interface DocNavItem {
  title: string;
  href: string;
  children?: DocNavItem[];
}