import { watch } from 'chokidar';
import path from 'path';
import { getConfig } from '../config';

export interface HotReloadOptions {
  onDocChange?: (filePath: string, event: 'add' | 'change' | 'unlink') => void;
  onNavigationChange?: () => void;
  enabled?: boolean;
}

export class DocsflyHotReload {
  private watcher: any = null;
  private options: HotReloadOptions;
  private docsDirectory: string;
  private isWatching = false;

  constructor(options: HotReloadOptions = {}) {
    this.options = {
      enabled: process.env.NODE_ENV === 'development',
      ...options,
    };
    
    const config = getConfig();
    this.docsDirectory = path.join(process.cwd(), config.docs.dir);
  }

  public start(): void {
    if (!this.options.enabled || this.isWatching) {
      return;
    }

    try {
      // Check if directory exists
      const fs = require('fs');
      if (!fs.existsSync(this.docsDirectory)) {
        console.error(`❌ Docs directory does not exist: ${this.docsDirectory}`);
        return;
      }

      const watchPattern = path.join(this.docsDirectory, '**/*.{md,mdx}');
      
      this.watcher = watch(watchPattern, {
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

      this.watcher
        .on('ready', () => {
          // File watcher is ready
        })
        .on('add', (filePath: string) => {
          this.options.onDocChange?.(filePath, 'add');
          this.options.onNavigationChange?.();
        })
        .on('change', (filePath: string) => {
          this.options.onDocChange?.(filePath, 'change');
        })
        .on('unlink', (filePath: string) => {
          this.options.onDocChange?.(filePath, 'unlink');
          this.options.onNavigationChange?.();
        })
        .on('error', (error: Error) => {
          console.error('❌ File watcher error:', error);
        });

      this.isWatching = true;
    } catch (error) {
      console.error('❌ Failed to start file watcher:', error);
    }
  }

  public stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      this.isWatching = false;
    }
  }

  public isEnabled(): boolean {
    return !!this.options.enabled;
  }

  public getWatchedDirectory(): string {
    return this.docsDirectory;
  }
}

// Cache for docs and navigation
const docsCache = new Map<string, any>();
const navigationCache = { data: null, timestamp: 0 };

export function createHotReloadCache() {
  return {
    docs: docsCache,
    navigation: navigationCache,
    
    clearDocsCache: () => {
      docsCache.clear();
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