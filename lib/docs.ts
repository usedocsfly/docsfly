import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

export async function getAllDocs(): Promise<Doc[]> {
  const docsDirectory = path.join(process.cwd(), 'docs');
  
  try {
    const files = await getMarkdownFiles(docsDirectory);
    const docs = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(docsDirectory, file);
        const content = await fs.readFile(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);
        
        return {
          slug: file.replace('.mdx', ''),
          meta: {
            title: data.title || file.replace('.mdx', '').replace(/-/g, ' '),
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
      })
    );
    
    return docs.sort((a, b) => a.meta.order - b.meta.order);
  } catch (error) {
    console.warn('Error reading docs directory:', error);
    return [];
  }
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const docsDirectory = path.join(process.cwd(), 'docs');
  const filePath = path.join(docsDirectory, `${slug}.mdx`);
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    return {
      slug,
      meta: {
        title: data.title || slug.replace(/-/g, ' '),
        description: data.description,
        order: data.order || 0,
        category: data.category,
        tags: data.tags || [],
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
      },
      content: markdownContent,
      path: `${slug}.mdx`,
    };
  } catch (error) {
    return null;
  }
}

export async function generateNavigation(): Promise<DocNavItem[]> {
  const docs = await getAllDocs();
  const categories = new Map<string, DocNavItem[]>();
  const uncategorized: DocNavItem[] = [];
  
  docs.forEach((doc) => {
    const navItem: DocNavItem = {
      title: doc.meta.title,
      href: `/docs/${doc.slug}`,
    };
    
    if (doc.meta.category) {
      if (!categories.has(doc.meta.category)) {
        categories.set(doc.meta.category, []);
      }
      categories.get(doc.meta.category)!.push(navItem);
    } else {
      uncategorized.push(navItem);
    }
  });
  
  const navigation: DocNavItem[] = [];
  
  // Add categorized items
  categories.forEach((items, category) => {
    navigation.push({
      title: category,
      href: '#',
      children: items.sort((a, b) => a.title.localeCompare(b.title)),
    });
  });
  
  // Add uncategorized items
  navigation.push(...uncategorized.sort((a, b) => a.title.localeCompare(b.title)));
  
  return navigation;
}

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  return files.filter(file => file.endsWith('.mdx'));
}