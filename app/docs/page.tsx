import Link from "next/link";
import { getAllDocs } from "@/lib/docs";
import { Badge } from "@/components/ui/badge";

export default async function DocsIndex() {
  const docs = await getAllDocs();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold mb-8">Documentation</h1>
      <p className="text-lg mb-8">
        Browse through our comprehensive documentation to get started with
        Docsfly.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="block p-6transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">{doc.meta.title}</h2>
            {doc.meta.description && (
              <p className="mb-4">{doc.meta.description}</p>
            )}
            {doc.meta.tags && doc.meta.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {doc.meta.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
