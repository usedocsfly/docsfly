import { serialize, SerializeResult } from "next-mdx-remote-client/serialize";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { getConfig } from "./config";
import { DocsflyHotReload, hotReloadCache } from "./hot-reload/reload";
import { notifyChange } from "./hot-reload/bridge";
import type {
  DocMeta,
  Doc,
  DocNavItem,
  CategoryConfig,
  BlogPost,
  BlogMeta,
} from "./types";
import remarkGfm from "remark-gfm";

const isMonorepo = process.env.DOCSFLY_IS_MONOREPO === "true";
const contentRootDir = isMonorepo
  ? path.join(process.cwd(), "../../")
  : process.cwd();

// Hot reload functionality - no cache revalidation needed in development

export async function mdxParse(source: string): Promise<SerializeResult> {
  return serialize({ source, options: { mdxOptions: { remarkPlugins: [remarkGfm]}} });
}

export async function getAllDocs(): Promise<Doc[]> {
  const config = getConfig();
  const docsDirectory = path.join(contentRootDir, config.docs.dir);

  try {
    const files = await getMarkdownFiles(docsDirectory);
    const docs = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace(".mdx", "").replace(/\\/g, "/");

        // In development mode, always bypass cache to get fresh content
        if (process.env.NODE_ENV === "development") {
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
        const content = await fs.readFile(filePath, "utf8");
        const { data, content: markdownContent } = matter(content);
        const mdxSource = await mdxParse(markdownContent);

        // Generate title from filename if not provided in frontmatter
        const filename = path.basename(file, ".mdx");
        const defaultTitle = filename.replace(/-/g, " ");

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
          content: mdxSource,
          path: file,
        };

        // Cache the document with its last modified time (only in production)
        if (process.env.NODE_ENV !== "development") {
          const stats = await fs.stat(filePath);
          hotReloadCache.setDocInCache(slug, {
            doc,
            lastModified: stats.mtime,
          });
        }

        return doc;
      })
    );

    return config.docs.sidebar?.autoSort !== false
      ? docs.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
      : docs;
  } catch (error) {
    console.warn("Error reading docs directory:", error);
    return [];
  }
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const config = getConfig();
  const docsDirectory = path.join(contentRootDir, config.docs.dir);

  // In development mode, always bypass cache for fresh content
  if (process.env.NODE_ENV !== "development") {
    // Check cache first in production mode
    const cachedDoc = hotReloadCache.getDocFromCache(slug);
    if (cachedDoc) {
      return cachedDoc.doc;
    }
  }

  // Try multiple possible file paths for the slug
  const possiblePaths = [
    `${slug}.mdx`, // Direct file: api/auth.mdx
    `${slug}/index.mdx`, // Index file: api/auth/index.mdx
  ];

  for (const relativePath of possiblePaths) {
    const filePath = path.join(docsDirectory, relativePath);

    try {
      const content = await fs.readFile(filePath, "utf8");
      const { data, content: markdownContent } = matter(content);
      const mdxSource = await mdxParse(markdownContent);

      // Generate title from slug if not provided in frontmatter
      const filename = path.basename(relativePath, ".mdx");
      const defaultTitle =
        filename === "index"
          ? slug.split("/").pop()?.replace(/-/g, " ") || slug
          : filename.replace(/-/g, " ");

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
        content: mdxSource,
        path: relativePath,
      };

      // Cache the document with its last modified time (only in production)
      if (process.env.NODE_ENV !== "development") {
        const stats = await fs.stat(filePath);
        hotReloadCache.setDocInCache(slug, {
          doc,
          lastModified: stats.mtime,
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
  if (process.env.NODE_ENV !== "development") {
    // Check cache first in production mode
    if (hotReloadCache.isNavigationCacheValid()) {
      const cachedNavigation = hotReloadCache.getNavigationFromCache();
      if (cachedNavigation) {
        return cachedNavigation;
      }
    }
  }

  const docs = await getAllDocs();
  const baseUrl = config.docs.baseUrl || "/docs";

  // Create a hierarchical structure from the docs
  const buildNavTree = async (docs: Doc[]): Promise<DocNavItem[]> => {
    const tree: DocNavItem[] = [];
    const nodeMap = new Map<string, DocNavItem>();
    const categoryConfigMap = new Map<string, CategoryConfig>();

    // Load category configurations
    await loadCategoryConfigs(categoryConfigMap);

    // First pass: create all nodes
    docs.forEach((doc) => {
      const pathSegments = doc.slug.split("/");
      let currentPath = "";

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
            title = categoryConfig?.name || segment.replace(/-/g, " ");
            order = categoryConfig?.order;
          }

          const navItem: DocNavItem = {
            title,
            href: isLast ? `${baseUrl}/${doc.slug}` : "#",
            children: isLast ? undefined : [],
            order,
            collapsed: isLast
              ? undefined
              : categoryConfigMap.get(currentPath)?.collapsed,
          };

          nodeMap.set(currentPath, navItem);
        }
      });
    });

    // Second pass: build the tree structure
    nodeMap.forEach((node, path) => {
      const segments = path.split("/");

      if (segments.length === 1) {
        // Root level item
        tree.push(node);
      } else {
        // Find parent and add as child
        const parentPath = segments.slice(0, -1).join("/");
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
      items.forEach((item) => {
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
  if (process.env.NODE_ENV !== "development") {
    hotReloadCache.setNavigationInCache(navigation);
  }

  return navigation;
}

async function getMarkdownFiles(
  dir: string,
  relativePath = ""
): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const markdownFiles: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const relativeFilePath = path.join(relativePath, file.name);

    if (file.isDirectory()) {
      // Recursively get files from subdirectories
      const subFiles = await getMarkdownFiles(fullPath, relativeFilePath);
      markdownFiles.push(...subFiles);
    } else if (file.name.endsWith(".mdx")) {
      markdownFiles.push(relativeFilePath);
    }
  }

  return markdownFiles;
}

async function loadCategoryConfigs(
  categoryConfigMap: Map<string, CategoryConfig>
): Promise<void> {
  const config = getConfig();
  const docsDirectory = path.join(contentRootDir, config.docs.dir);

  // Recursively find all _category.json files
  const findCategoryFiles = async (
    dir: string,
    relativePath = ""
  ): Promise<void> => {
    try {
      const files = await fs.readdir(dir, { withFileTypes: true });

      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relativeFilePath = path.join(relativePath, file.name);

        if (file.isDirectory()) {
          // Check for _category.json in this directory
          const categoryFilePath = path.join(fullPath, "_category.json");
          try {
            const categoryContent = await fs.readFile(categoryFilePath, "utf8");
            const categoryConfig: CategoryConfig = JSON.parse(categoryContent);
            const categoryKey = relativePath
              ? `${relativePath}/${file.name}`
              : file.name;
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
  onDocChange?: (filePath: string, event: "add" | "change" | "unlink") => void;
  onBlogChange?: (filePath: string, event: "add" | "change" | "unlink") => void;
  onNavigationChange?: () => void;
}) {
  if (hotReloadInstance) {
    return hotReloadInstance;
  }

  hotReloadInstance = new DocsflyHotReload({
    onDocChange: (filePath, event) => {
      const config = getConfig();
      const slug = path
        .relative(path.join(contentRootDir, config.docs.dir), filePath)
        .replace(".mdx", "")
        .replace(/\\/g, "/");

      if (event === "change") {
        hotReloadCache.removeDocFromCache(slug);
      } else if (event === "add") {
        hotReloadCache.clearNavigationCache();
      } else if (event === "unlink") {
        hotReloadCache.removeDocFromCache(slug);
        hotReloadCache.clearNavigationCache();
      }

      // Notify clients through the global bridge
      notifyChange();

      options?.onDocChange?.(filePath, event);
    },
    onBlogChange: (filePath, event) => {
      const config = getConfig();
      if (!config.blog?.enabled) return;

      const slug = path
        .relative(path.join(contentRootDir, config.blog.dir), filePath)
        .replace(".mdx", "")
        .replace(/\\/g, "/");

      if (event === "change") {
        hotReloadCache.removeBlogPostFromCache(slug);
        hotReloadCache.clearBlogCache(); // Clear list cache when individual posts change
      } else if (event === "add") {
        hotReloadCache.clearBlogCache(); // Clear all blog cache when posts are added
      } else if (event === "unlink") {
        hotReloadCache.removeBlogPostFromCache(slug);
        hotReloadCache.clearBlogCache(); // Clear list cache when posts are removed
      }

      // Notify clients through the global bridge
      notifyChange();

      options?.onBlogChange?.(filePath, event);
    },
    onNavigationChange: () => {
      hotReloadCache.clearNavigationCache();
      options?.onNavigationChange?.();
    },
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

// Blog functionality
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const config = getConfig();

  if (!config.blog?.enabled) {
    return [];
  }

  const blogDirectory = path.join(contentRootDir, config.blog.dir);

  try {
    const files = await getMarkdownFiles(blogDirectory);
    const posts = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace(".mdx", "").replace(/\\/g, "/");

        // In development mode, always bypass cache to get fresh content
        if (process.env.NODE_ENV === "development") {
          // Force fresh reads in development
        } else {
          // Check cache first in production mode
          const cachedPost = hotReloadCache.getBlogPostFromCache(slug);
          if (cachedPost) {
            try {
              const filePath = path.join(blogDirectory, file);
              const stats = await fs.stat(filePath);
              if (stats.mtime <= cachedPost.lastModified) {
                return cachedPost.post;
              }
            } catch (error) {
              // File might not exist anymore, remove from cache
              hotReloadCache.removeBlogPostFromCache(slug);
            }
          }
        }

        const filePath = path.join(blogDirectory, file);
        const content = await fs.readFile(filePath, "utf8");
        const { data, content: markdownContent } = matter(content);
        const mdxSource = await mdxParse(markdownContent);

        // Generate title from filename if not provided
        const filename = path.basename(file, ".mdx");
        const defaultTitle = filename.replace(/-/g, " ");

        // Generate excerpt from content (first 150 characters)
        const excerpt =
          markdownContent.slice(0, 150).replace(/\n/g, " ").trim() + "...";

        const post: BlogPost = {
          slug,
          meta: {
            title: data.title || defaultTitle,
            description: data.description,
            author: data.author,
            date: data.date,
            tags: data.tags || [],
            draft: data.draft || false,
            featured: data.featured || false,
            image: data.image,
          },
          content: mdxSource,
          path: file,
          excerpt,
        };

        // Cache the post with its last modified time (only in production)
        if (process.env.NODE_ENV !== "development") {
          const stats = await fs.stat(filePath);
          hotReloadCache.setBlogPostInCache(slug, {
            post,
            lastModified: stats.mtime,
          });
        }

        return post;
      })
    );

    // Filter out drafts in production and sort by date
    const filteredPosts =
      process.env.NODE_ENV === "development"
        ? posts
        : posts.filter((post) => !post.meta.draft);

    return filteredPosts.sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );
  } catch (error) {
    console.warn("Error reading blog directory:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const config = getConfig();

  if (!config.blog?.enabled) {
    return null;
  }

  // In development mode, always bypass cache for fresh content
  if (process.env.NODE_ENV !== "development") {
    // Check cache first in production mode
    const cachedPost = hotReloadCache.getBlogPostFromCache(slug);
    if (cachedPost) {
      return cachedPost.post;
    }
  }

  const blogDirectory = path.join(contentRootDir, config.blog.dir);
  const filePath = path.join(blogDirectory, `${slug}.mdx`);

  try {
    const content = await fs.readFile(filePath, "utf8");
    const { data, content: markdownContent } = matter(content);
    const mdxSource = await mdxParse(markdownContent);

    const filename = path.basename(slug, ".mdx");
    const defaultTitle = filename.replace(/-/g, " ");
    const excerpt =
      markdownContent.slice(0, 150).replace(/\n/g, " ").trim() + "...";

    const post: BlogPost = {
      slug,
      meta: {
        title: data.title || defaultTitle,
        description: data.description,
        author: data.author,
        date: data.date,
        tags: data.tags || [],
        draft: data.draft || false,
        featured: data.featured || false,
        image: data.image,
      },
      content: mdxSource,
      path: `${slug}.mdx`,
      excerpt,
    };

    // Cache the post with its last modified time (only in production)
    if (process.env.NODE_ENV !== "development") {
      const stats = await fs.stat(filePath);
      hotReloadCache.setBlogPostInCache(slug, {
        post,
        lastModified: stats.mtime,
      });
    }

    return post;
  } catch (error) {
    return null;
  }
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.meta.tags?.includes(tag));
}

export async function getBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

// Version functionality
export async function getAllDocsForVersion(version: string): Promise<Doc[]> {
  const config = getConfig();

  if (!config.versions?.enabled) {
    return getAllDocs();
  }

  const versionConfig = config.versions.versions.find(
    (v) => v.name === version
  );
  if (!versionConfig) {
    return [];
  }

  const docsDirectory = path.join(contentRootDir, versionConfig.dir);

  try {
    const files = await getMarkdownFiles(docsDirectory);
    const docs = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace(".mdx", "").replace(/\\/g, "/");
        const filePath = path.join(docsDirectory, file);
        const content = await fs.readFile(filePath, "utf8");
        const { data, content: markdownContent } = matter(content);
        const mdxSource = await mdxParse(markdownContent);

        const filename = path.basename(file, ".mdx");
        const defaultTitle = filename.replace(/-/g, " ");

        const doc: Doc = {
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
          content: mdxSource,
          path: file,
          version,
        };

        return doc;
      })
    );

    return config.docs.sidebar?.autoSort !== false
      ? docs.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
      : docs;
  } catch (error) {
    console.warn(`Error reading docs directory for version ${version}:`, error);
    return [];
  }
}

export async function getDocBySlugAndVersion(
  slug: string,
  version: string
): Promise<Doc | null> {
  const config = getConfig();

  if (!config.versions?.enabled) {
    return getDocBySlug(slug);
  }

  const versionConfig = config.versions.versions.find(
    (v) => v.name === version
  );
  if (!versionConfig) {
    return null;
  }

  const docsDirectory = path.join(contentRootDir, versionConfig.dir);

  const possiblePaths = [`${slug}.mdx`, `${slug}/index.mdx`];

  for (const relativePath of possiblePaths) {
    const filePath = path.join(docsDirectory, relativePath);

    try {
      const content = await fs.readFile(filePath, "utf8");
      const { data, content: markdownContent } = matter(content);
      const mdxSource = await mdxParse(markdownContent);

      const filename = path.basename(relativePath, ".mdx");
      const defaultTitle =
        filename === "index"
          ? slug.split("/").pop()?.replace(/-/g, " ") || slug
          : filename.replace(/-/g, " ");

      const doc: Doc = {
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
        content: mdxSource,
        path: relativePath,
        version,
      };

      return doc;
    } catch (error) {
      continue;
    }
  }

  return null;
}

export async function generateNavigationForVersion(
  version: string
): Promise<DocNavItem[]> {
  const config = getConfig();

  if (!config.versions?.enabled) {
    return generateNavigation();
  }

  const docs = await getAllDocsForVersion(version);
  const versionConfig = config.versions.versions.find(
    (v) => v.name === version
  );
  const baseUrl = `${config.docs.baseUrl || "/docs"}/${version}`;

  // Reuse the same navigation building logic but with version-specific docs
  const buildNavTree = async (docs: Doc[]): Promise<DocNavItem[]> => {
    const tree: DocNavItem[] = [];
    const nodeMap = new Map<string, DocNavItem>();
    const categoryConfigMap = new Map<string, CategoryConfig>();

    // Load category configurations from version-specific directory
    if (versionConfig) {
      await loadCategoryConfigsForVersion(categoryConfigMap, versionConfig.dir);
    }

    // Build tree structure (same logic as generateNavigation)
    docs.forEach((doc) => {
      const pathSegments = doc.slug.split("/");
      let currentPath = "";

      pathSegments.forEach((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        if (!nodeMap.has(currentPath)) {
          let title: string;
          let order: number | undefined;

          if (isLast) {
            title = doc.meta.title;
            order = doc.meta.order;
          } else {
            const categoryConfig = categoryConfigMap.get(currentPath);
            title = categoryConfig?.name || segment.replace(/-/g, " ");
            order = categoryConfig?.order;
          }

          const navItem: DocNavItem = {
            title,
            href: isLast ? `${baseUrl}/${doc.slug}` : "#",
            children: isLast ? undefined : [],
            order,
            collapsed: isLast
              ? undefined
              : categoryConfigMap.get(currentPath)?.collapsed,
          };

          nodeMap.set(currentPath, navItem);
        }
      });
    });

    // Build tree structure and sort
    nodeMap.forEach((node, path) => {
      const segments = path.split("/");

      if (segments.length === 1) {
        tree.push(node);
      } else {
        const parentPath = segments.slice(0, -1).join("/");
        const parent = nodeMap.get(parentPath);

        if (parent && parent.children) {
          parent.children.push(node);
        }
      }
    });

    const sortItems = (items: DocNavItem[]) => {
      return items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return a.title.localeCompare(b.title);
      });
    };

    const sortRecursive = (items: DocNavItem[]) => {
      sortItems(items);
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          sortRecursive(item.children);
        }
      });
    };

    sortRecursive(tree);
    return tree;
  };

  return buildNavTree(docs);
}

async function loadCategoryConfigsForVersion(
  categoryConfigMap: Map<string, CategoryConfig>,
  versionDir: string
): Promise<void> {
  const docsDirectory = path.join(contentRootDir, versionDir);

  const findCategoryFiles = async (
    dir: string,
    relativePath = ""
  ): Promise<void> => {
    try {
      const files = await fs.readdir(dir, { withFileTypes: true });

      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relativeFilePath = path.join(relativePath, file.name);

        if (file.isDirectory()) {
          const categoryFilePath = path.join(fullPath, "_category.json");
          try {
            const categoryContent = await fs.readFile(categoryFilePath, "utf8");
            const categoryConfig: CategoryConfig = JSON.parse(categoryContent);
            const categoryKey = relativePath
              ? `${relativePath}/${file.name}`
              : file.name;
            categoryConfigMap.set(categoryKey, categoryConfig);
          } catch (error) {
            // No category config file
          }

          await findCategoryFiles(fullPath, relativeFilePath);
        }
      }
    } catch (error) {
      // Directory doesn't exist
    }
  };

  await findCategoryFiles(docsDirectory);
}

// Navigation utilities
export function getPrevNextDocs(
  currentSlug: string,
  navigation: DocNavItem[]
): { prev: DocNavItem | null; next: DocNavItem | null } {
  const flattenedDocs: DocNavItem[] = [];

  function flattenNavigation(items: DocNavItem[]) {
    for (const item of items) {
      if (item.href && item.href !== "#") {
        flattenedDocs.push(item);
      }
      if (item.children) {
        flattenNavigation(item.children);
      }
    }
  }

  flattenNavigation(navigation);

  const config = getConfig();
  const baseUrl = config.docs.baseUrl || "/docs";
  const currentHref = `${baseUrl}/${currentSlug}`;

  const currentIndex = flattenedDocs.findIndex(
    (doc) => doc.href === currentHref
  );

  return {
    prev: currentIndex > 0 ? flattenedDocs[currentIndex - 1] : null,
    next:
      currentIndex < flattenedDocs.length - 1
        ? flattenedDocs[currentIndex + 1]
        : null,
  };
}

// Export types
export type { DocMeta, Doc, DocNavItem, CategoryConfig, BlogPost, BlogMeta };
