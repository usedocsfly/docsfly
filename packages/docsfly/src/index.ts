// Export types
export type { DocsflyConfig, DocMeta, Doc, DocNavItem } from './types';

// Export configuration utilities
export { loadConfig, getConfig } from './config';

// Export documentation utilities
export { getAllDocs, getDocBySlug, generateNavigation, initializeHotReload, getHotReloadInstance, stopHotReload } from './docs';

// Export components
export { Sidebar, DocsListing, DocsLayout, DocsPage, MainLayout, Search, NavigationItem, Header } from './components';

// Export hot reload utilities
export { DocsflyHotReload, hotReloadCache } from './hot-reload/reload';
export { setNotifyCallback, getNotifyCallback, notifyChange } from './hot-reload/bridge';
export { GET, POST } from './hot-reload/actions';

// Re-export for backward compatibility
export * from './docs';