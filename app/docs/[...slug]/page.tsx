import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { Badge } from '@/components/ui/badge';

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage({ params }: Props) {
  const slug = (await params).slug.join('/');
  const doc = await getDocBySlug(slug);
  
  if (!doc) {
    notFound();
  }

  const components = useMDXComponents({});

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">
            {doc.meta.title}
          </h1>
          {doc.meta.description && (
            <p className="text-lg text-foreground/80">
              {doc.meta.description}
            </p>
          )}
          {doc.meta.tags && doc.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {doc.meta.tags.map((tag) => (
                <Badge key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>
        <MDXRemote source={doc.content} components={components} />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const docs = await getAllDocs();
  
  return docs.map(doc => ({
    slug: [doc.slug],
  }));
}

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug.join('/');
  const doc = await getDocBySlug(slug);
  
  if (!doc) {
    return {};
  }
  
  return {
    title: doc.meta.title,
    description: doc.meta.description,
  };
}