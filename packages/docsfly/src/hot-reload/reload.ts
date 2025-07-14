import { watch } from 'chokidar';
import path from 'path';
import { getConfig } from '../config';

export interface HotReloadOptions {
  onDocChange?: (filePath: string, event: 'add' | 'change' | 'unlink') => void;
  onBlogChange?: (filePath: string, event: 'add' | 'change' | 'unlink') => void;
  onNavigationChange?: () => void;
  enabled?: boolean;
}

export class DocsflyHotReload {
  private docsWatcher: any = null;
  private blogWatcher: any = null;
  private options: HotReloadOptions;
  private docsDirectory: string;
  private blogDirectory: string | null;
  private isWatching = false;

  constructor(options: HotReloadOptions = {}) {
    this.options = {
      enabled: process.env.NODE_ENV === 'development',
      ...options,
    };
    
    const config = getConfig();
    this.docsDirectory = path.join(process.cwd(), config.docs.dir);
    this.blogDirectory = config.blog?.enabled ? path.join(process.cwd(), config.blog.dir) : null;
  }

  public start(): void {
    if (!this.options.enabled || this.isWatching) {
      return;
    }

    try {
      const fs = require('fs');
      
      // Start docs watcher
      if (fs.existsSync(this.docsDirectory)) {
        this.startDocsWatcher();
      } else {
        console.error(`❌ Docs directory does not exist: ${this.docsDirectory}`);
      }

      // Start blog watcher if blog is enabled
      if (this.blogDirectory && fs.existsSync(this.blogDirectory)) {
        this.startBlogWatcher();
      }

      this.isWatching = true;
    } catch (error) {
      console.error('❌ Failed to start file watchers:', error);
    }
  }

  private startDocsWatcher(): void {
    this.docsWatcher = watch(this.docsDirectory, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      usePolling: false, // Force polling mode for WSL compatibility
      interval: 1000,
      binaryInterval: 1000,
      depth: 10, // Allow deep nested files
      followSymlinks: false
    });

    this.docsWatcher
      .on('ready', () => {
        // File watcher is ready
      })
      .on('add', (filePath: string) => {
        if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
          this.options.onDocChange?.(filePath, 'add');
          this.options.onNavigationChange?.();
        }
      })
      .on('change', (filePath: string) => {
        if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
          this.options.onDocChange?.(filePath, 'change');
        }
      })
      .on('unlink', (filePath: string) => {
        if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
          this.options.onDocChange?.(filePath, 'unlink');
          this.options.onNavigationChange?.();
        }
      })
      .on('error', (error: Error) => {
        console.error('❌ Docs file watcher error:', error);
      });
  }

  private startBlogWatcher(): void {
    if (!this.blogDirectory) return;

    const watchPattern = path.join(this.blogDirectory, '**/*.{md,mdx}');
    
    this.blogWatcher = watch(watchPattern, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      usePolling: false,
      interval: 100,
      binaryInterval: 300,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      }
    });

    this.blogWatcher
      .on('ready', () => {
        // Blog watcher is ready
      })
      .on('add', (filePath: string) => {
        this.options.onBlogChange?.(filePath, 'add');
      })
      .on('change', (filePath: string) => {
        this.options.onBlogChange?.(filePath, 'change');
      })
      .on('unlink', (filePath: string) => {
        this.options.onBlogChange?.(filePath, 'unlink');
      })
      .on('error', (error: Error) => {
        console.error('❌ Blog file watcher error:', error);
      });
  }

  public stop(): void {
    if (this.docsWatcher) {
      this.docsWatcher.close();
      this.docsWatcher = null;
    }
    
    if (this.blogWatcher) {
      this.blogWatcher.close();
      this.blogWatcher = null;
    }
    
    this.isWatching = false;
  }

  public isEnabled(): boolean {
    return !!this.options.enabled;
  }

  public getWatchedDirectory(): string {
    return this.docsDirectory;
  }
}

// Global cache that survives Next.js hot reloads
declare global {
  var __DOCSFLY_DOCS_CACHE__: Map<string, any> | undefined;
  var __DOCSFLY_BLOG_CACHE__: Map<string, any> | undefined;
  var __DOCSFLY_BLOG_LIST_CACHE__: { data: any; timestamp: number } | undefined;
  var __DOCSFLY_NAVIGATION_CACHE__: { data: any; timestamp: number } | undefined;
}

// Initialize or reuse global cache
const docsCache = global.__DOCSFLY_DOCS_CACHE__ || (global.__DOCSFLY_DOCS_CACHE__ = new Map<string, any>());
const blogCache = global.__DOCSFLY_BLOG_CACHE__ || (global.__DOCSFLY_BLOG_CACHE__ = new Map<string, any>());
const blogListCache = global.__DOCSFLY_BLOG_LIST_CACHE__ || (global.__DOCSFLY_BLOG_LIST_CACHE__ = { data: null, timestamp: 0 });
const navigationCache = global.__DOCSFLY_NAVIGATION_CACHE__ || (global.__DOCSFLY_NAVIGATION_CACHE__ = { data: null, timestamp: 0 });

export function createHotReloadCache() {
  return {
    docs: docsCache,
    blog: blogCache,
    blogList: blogListCache,
    navigation: navigationCache,
    
    clearDocsCache: () => {
      docsCache.clear();
    },
    
    clearBlogCache: () => {
      blogCache.clear();
      blogListCache.data = null;
      blogListCache.timestamp = 0;
    },
    
    clearNavigationCache: () => {
      navigationCache.data = null;
      navigationCache.timestamp = 0;
    },
    
    getDocFromCache: (slug: string) => {
      return docsCache.get(slug);
    },
    
    setDocInCache: (slug: string, doc: any) => {
      docsCache.set(slug, doc);
    },
    
    removeDocFromCache: (slug: string) => {
      docsCache.delete(slug);
    },
    
    getBlogPostFromCache: (slug: string) => {
      return blogCache.get(slug);
    },
    
    setBlogPostInCache: (slug: string, post: any) => {
      blogCache.set(slug, post);
    },
    
    removeBlogPostFromCache: (slug: string) => {
      blogCache.delete(slug);
    },
    
    getBlogListFromCache: () => {
      return blogListCache.data;
    },
    
    setBlogListInCache: (data: any) => {
      blogListCache.data = data;
      blogListCache.timestamp = Date.now();
    },
    
    isBlogListCacheValid: (maxAge: number = 5000) => {
      return blogListCache.data && (Date.now() - blogListCache.timestamp) < maxAge;
    },
    
    getNavigationFromCache: () => {
      return navigationCache.data;
    },
    
    setNavigationInCache: (data: any) => {
      navigationCache.data = data;
      navigationCache.timestamp = Date.now();
    },
    
    isNavigationCacheValid: (maxAge: number = 5000) => {
      return navigationCache.data && (Date.now() - navigationCache.timestamp) < maxAge;
    }
  };
}

export const hotReloadCache = createHotReloadCache();