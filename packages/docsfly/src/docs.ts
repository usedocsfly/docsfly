import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getConfig } from './config';
import { DocsflyHotReload, hotReloadCache } from './hot-reload/reload';
import { notifyChange } from './hot-reload/bridge';
import type { DocMeta, Doc, DocNavItem, CategoryConfig } from './types';

// Hot reload functionality - no cache revalidation needed in development

export async function getAllDocs(): Promise<Doc[]> {
  const config = getConfig();
  const docsDirectory = path.join(process.cwd(), config.docs.dir);
  
  try {
    const files = await getMarkdownFiles(docsDirectory);
    const docs = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace('.mdx', '').replace(/\\/g, '/');
        
        // In development mode, always bypass cache to get fresh content
        if (process.env.NODE_ENV === 'development') {
          // Force fresh reads in development
        } else {
          // Check cache first in production mode
          const cachedDoc = hotReloadCache.getDocFromCache(slug);
          if (cachedDoc) {
            try {
              const filePath = path.join(docsDirectory, file);
              const stats = await fs.stat(filePath);
              if (stats.mtime <= cachedDoc.lastModified) {
                return cachedDoc.doc;
              }
            } catch (error) {
              // File might not exist anymore, remove from cache
              hotReloadCache.removeDocFromCache(slug);
            }
          }
        }
        
        const filePath = path.join(docsDirectory, file);
        const content = await fs.readFile(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);
        
        // Generate title from filename if not provided in frontmatter
        const filename = path.basename(file, '.mdx');
        const defaultTitle = filename.replace(/-/g, ' ');
        
        const doc = {
          slug,
          meta: {
            title: data.title || defaultTitle,
            description: data.description,
            order: data.order || 0,
            category: data.category,
            tags: data.tags || [],
            publishedAt: data.publishedAt,
            updatedAt: data.updatedAt,
          },
          content: markdownContent,
          path: file,
        };
        
        // Cache the document with its last modified time (only in production)
        if (process.env.NODE_ENV !== 'development') {
          const stats = await fs.stat(filePath);
          hotReloadCache.setDocInCache(slug, {
            doc,
            lastModified: stats.mtime
          });
        }
        
        return doc;
      })
    );
    
    return config.docs.sidebar?.autoSort !== false
      ? docs.sort((a, b) => a.meta.order - b.meta.order)
      : docs;
  } catch (error) {
    console.warn('Error reading docs directory:', error);
    return [];
  }
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const config = getConfig();
  const docsDirectory = path.join(process.cwd(), config.docs.dir);
  
  // In development mode, always bypass cache for fresh content
  if (process.env.NODE_ENV !== 'development') {
    // Check cache first in production mode
    const cachedDoc = hotReloadCache.getDocFromCache(slug);
    if (cachedDoc) {
      return cachedDoc.doc;
    }
  }
  
  // Try multiple possible file paths for the slug
  const possiblePaths = [
    `${slug}.mdx`,                    // Direct file: api/auth.mdx
    `${slug}/index.mdx`,              // Index file: api/auth/index.mdx
  ];
  
  for (const relativePath of possiblePaths) {
    const filePath = path.join(docsDirectory, relativePath);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { data, content: markdownContent } = matter(content);
      
      // Generate title from slug if not provided in frontmatter
      const filename = path.basename(relativePath, '.mdx');
      const defaultTitle = filename === 'index' 
        ? slug.split('/').pop()?.replace(/-/g, ' ') || slug
        : filename.replace(/-/g, ' ');
      
      const doc = {
        slug,
        meta: {
          title: data.title || defaultTitle,
          description: data.description,
          order: data.order || 0,
          category: data.category,
          tags: data.tags || [],
          publishedAt: data.publishedAt,
          updatedAt: data.updatedAt,
        },
        content: markdownContent,
        path: relativePath,
      };
      
      // Cache the document with its last modified time (only in production)
      if (process.env.NODE_ENV !== 'development') {
        const stats = await fs.stat(filePath);
        hotReloadCache.setDocInCache(slug, {
          doc,
          lastModified: stats.mtime
        });
      }
      
      return doc;
    } catch (error) {
      // Continue to next possible path
      continue;
    }
  }
  
  return null;
}

export async function generateNavigation(): Promise<DocNavItem[]> {
  const config = getConfig();
  
  // In development mode, always generate fresh navigation
  if (process.env.NODE_ENV !== 'development') {
    // Check cache first in production mode
    if (hotReloadCache.isNavigationCacheValid()) {
      const cachedNavigation = hotReloadCache.getNavigationFromCache();
      if (cachedNavigation) {
        return cachedNavigation;
      }
    }
  }
  
  const docs = await getAllDocs();
  const baseUrl = config.docs.baseUrl || '/docs';
  
  // Create a hierarchical structure from the docs
  const buildNavTree = async (docs: Doc[]): Promise<DocNavItem[]> => {
    const tree: DocNavItem[] = [];
    const nodeMap = new Map<string, DocNavItem>();
    const categoryConfigMap = new Map<string, CategoryConfig>();
    
    // Load category configurations
    await loadCategoryConfigs(categoryConfigMap);
    
    // First pass: create all nodes
    docs.forEach((doc) => {
      const pathSegments = doc.slug.split('/');
      let currentPath = '';
      
      pathSegments.forEach((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        
        if (!nodeMap.has(currentPath)) {
          let title: string;
          let order: number | undefined;
          
          if (isLast) {
            // This is a document
            title = doc.meta.title;
            order = doc.meta.order;
          } else {
            // This is a directory - check for category config
            const categoryConfig = categoryConfigMap.get(currentPath);
            title = categoryConfig?.name || segment.replace(/-/g, ' ');
            order = categoryConfig?.order;
          }
          
          const navItem: DocNavItem = {
            title,
            href: isLast ? `${baseUrl}/${doc.slug}` : '#',
            children: isLast ? undefined : [],
            order,
            collapsed: isLast ? undefined : categoryConfigMap.get(currentPath)?.collapsed,
          };
          
          nodeMap.set(currentPath, navItem);
        }
      });
    });
    
    // Second pass: build the tree structure
    nodeMap.forEach((node, path) => {
      const segments = path.split('/');
      
      if (segments.length === 1) {
        // Root level item
        tree.push(node);
      } else {
        // Find parent and add as child
        const parentPath = segments.slice(0, -1).join('/');
        const parent = nodeMap.get(parentPath);
        
        if (parent && parent.children) {
          parent.children.push(node);
        }
      }
    });
    
    // Sort function - prioritize order, then title
    const sortItems = (items: DocNavItem[]) => {
      return items.sort((a, b) => {
        // First sort by order if both have it
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // If only one has order, it comes first
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        // Otherwise sort by title
        return a.title.localeCompare(b.title);
      });
    };
    
    // Recursively sort all items
    const sortRecursive = (items: DocNavItem[]) => {
      sortItems(items);
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortRecursive(item.children);
        }
      });
    };
    
    sortRecursive(tree);
    
    return tree;
  };
  
  const navigation = await buildNavTree(docs);
  
  // Cache the navigation (only in production)
  if (process.env.NODE_ENV !== 'development') {
    hotReloadCache.setNavigationInCache(navigation);
  }
  
  return navigation;
}

async function getMarkdownFiles(dir: string, relativePath = ''): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const markdownFiles: string[] = [];
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const relativeFilePath = path.join(relativePath, file.name);
    
    if (file.isDirectory()) {
      // Recursively get files from subdirectories
      const subFiles = await getMarkdownFiles(fullPath, relativeFilePath);
      markdownFiles.push(...subFiles);
    } else if (file.name.endsWith('.mdx')) {
      markdownFiles.push(relativeFilePath);
    }
  }
  
  return markdownFiles;
}

async function loadCategoryConfigs(categoryConfigMap: Map<string, CategoryConfig>): Promise<void> {
  const config = getConfig();
  const docsDirectory = path.join(process.cwd(), config.docs.dir);
  
  // Recursively find all _category.json files
  const findCategoryFiles = async (dir: string, relativePath = ''): Promise<void> => {
    try {
      const files = await fs.readdir(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relativeFilePath = path.join(relativePath, file.name);
        
        if (file.isDirectory()) {
          // Check for _category.json in this directory
          const categoryFilePath = path.join(fullPath, '_category.json');
          try {
            const categoryContent = await fs.readFile(categoryFilePath, 'utf8');
            const categoryConfig: CategoryConfig = JSON.parse(categoryContent);
            const categoryKey = relativePath ? `${relativePath}/${file.name}` : file.name;
            categoryConfigMap.set(categoryKey, categoryConfig);
          } catch (error) {
            // No _category.json file or parsing error, continue
          }
          
          // Recursively check subdirectories
          await findCategoryFiles(fullPath, relativeFilePath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  };
  
  await findCategoryFiles(docsDirectory);
}

// Hot reload functionality
let hotReloadInstance: DocsflyHotReload | null = null;

export function initializeHotReload(options?: {
  onDocChange?: (filePath: string, event: 'add' | 'change' | 'unlink') => void;
  onNavigationChange?: () => void;
}) {
  if (hotReloadInstance) {
    return hotReloadInstance;
  }

  hotReloadInstance = new DocsflyHotReload({
    onDocChange: (filePath, event) => {
      const config = getConfig();
      const slug = path.relative(path.join(process.cwd(), config.docs.dir), filePath)
        .replace('.mdx', '')
        .replace(/\\/g, '/');
            
      if (event === 'change') {
        hotReloadCache.removeDocFromCache(slug);
      } else if (event === 'add') {
        hotReloadCache.clearNavigationCache();
      } else if (event === 'unlink') {
        hotReloadCache.removeDocFromCache(slug);
        hotReloadCache.clearNavigationCache();
      }
      
      // Notify clients through the global bridge
      notifyChange();
      
      options?.onDocChange?.(filePath, event);
    },
    onNavigationChange: () => {
      hotReloadCache.clearNavigationCache();
      options?.onNavigationChange?.();
    }
  });

  hotReloadInstance.start();
  return hotReloadInstance;
}

export function getHotReloadInstance(): DocsflyHotReload | null {
  return hotReloadInstance;
}

export function stopHotReload() {
  if (hotReloadInstance) {
    hotReloadInstance.stop();
    hotReloadInstance = null;
  }
}

// Export types
export type { DocMeta, Doc, DocNavItem, CategoryConfig };