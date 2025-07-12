'use client';

import React from 'react';
import { Doc } from '../types';
import { getConfig } from '../config';
import Link from 'next/link'; // Ensure this is imported correctly

interface DocsListingProps {
  docs: Doc[];
  className?: string;
  showDescription?: boolean;
  showTags?: boolean;
  showDate?: boolean;
  groupByCategory?: boolean;
}

export function DocsListing({
  docs,
  className = '',
  showDescription = true,
  showTags = true,
  showDate = true,
  groupByCategory = true,
}: DocsListingProps) {
  const config = getConfig();
  
  if (groupByCategory) {
    const grouped = groupDocsByCategory(docs);
    return (
      <div className={`space-y-8 ${className}`}>
        {Object.entries(grouped).map(([category, categoryDocs]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {category}
            </h2>
            <div className="grid gap-4">
              {categoryDocs.map((doc) => (
                <DocCard
                  key={doc.slug}
                  doc={doc}
                  showDescription={showDescription}
                  showTags={showTags}
                  showDate={showDate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {docs.map((doc) => (
        <DocCard
          key={doc.slug}
          doc={doc}
          showDescription={showDescription}
          showTags={showTags}
          showDate={showDate}
        />
      ))}
    </div>
  );
}

interface DocCardProps {
  doc: Doc;
  showDescription?: boolean;
  showTags?: boolean;
  showDate?: boolean;
}

function DocCard({ doc, showDescription, showTags, showDate }: DocCardProps) {
  const config = getConfig();

  const href = `${config.docs.baseUrl || '/docs'}/${doc.slug}`;

  const CardContent = () => (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors">
          {doc.meta.title}
        </h3>
        {showDate && doc.meta.publishedAt && (
          <span className="text-sm text-muted-foreground">
            {new Date(doc.meta.publishedAt).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {showDescription && doc.meta.description && (
        <p className="text-muted-foreground mb-3 line-clamp-2">
          {doc.meta.description}
        </p>
      )}
      
      {showTags && doc.meta.tags && doc.meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {doc.meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (!Link) {
    return (
      <a href={href} className="block hover:no-underline">
        <CardContent />
      </a>
    );
  }

  return (
    <Link href={href} className="block hover:no-underline">
      <CardContent />
    </Link>
  );
}

function groupDocsByCategory(docs: Doc[]): Record<string, Doc[]> {
  const grouped: Record<string, Doc[]> = {};
  
  docs.forEach((doc) => {
    const category = doc.meta.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  });
  
  // Sort categories and docs within each category
  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));
  });
  
  return grouped;
}