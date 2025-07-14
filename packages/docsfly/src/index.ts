// Export types
export type { DocsflyConfig, DocMeta, Doc, DocNavItem, BlogPost, BlogMeta } from './types';

// Export configuration utilities
export { loadConfig, getConfig } from './config';

// Export documentation utilities
export { 
  getAllDocs, 
  getDocBySlug, 
  generateNavigation, 
  getPrevNextDocs,
  initializeHotReload, 
  getHotReloadInstance, 
  stopHotReload,
  // Blog functions
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByTag,
  getBlogTags,
  // Version functions
  getAllDocsForVersion,
  getDocBySlugAndVersion,
  generateNavigationForVersion
} from './docs';

// Export components
export { 
  Sidebar, 
  DocsListing, 
  DocsLayout, 
  DocsPage, 
  PrevNext,
  MainLayout, 
  Search, 
  NavigationItem, 
  Header,
  // Blog components
  BlogLayout,
  BlogPostComponent,
  BlogListing,
  // Version components
  VersionSelector
} from './components';

// Export hot reload utilities
export { DocsflyHotReload, hotReloadCache } from './hot-reload/reload';
export { setNotifyCallback, getNotifyCallback, notifyChange } from './hot-reload/bridge';
export { GET, POST } from './hot-reload/actions';

// Re-export for backward compatibility
export * from './docs';