'use client';

import React, { useState, useEffect } from 'react';
import { Doc } from '../types';
import { getConfig } from '../config';

interface SearchProps {
  docs: Doc[];
  onSelect?: (doc: Doc) => void;
  placeholder?: string;
  className?: string;
}

export function Search({ 
  docs, 
  onSelect, 
  placeholder = 'Search documentation...', 
  className = '' 
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const config = getConfig();

  useEffect(() => {
    if (query.length > 0) {
      const filtered = docs.filter(doc =>
        doc.meta.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.meta.description?.toLowerCase().includes(query.toLowerCase()) ||
        doc.meta.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        doc.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDocs(filtered);
      setIsOpen(true);
    } else {
      setFilteredDocs([]);
      setIsOpen(false);
    }
  }, [query, docs]);

  const handleSelect = (doc: Doc) => {
    setQuery('');
    setIsOpen(false);
    onSelect?.(doc);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-4 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      
      {isOpen && filteredDocs.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
          {filteredDocs.map((doc) => (
            <SearchResult
              key={doc.slug}
              doc={doc}
              query={query}
              onSelect={() => handleSelect(doc)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SearchResultProps {
  doc: Doc;
  query: string;
  onSelect: () => void;
}

function SearchResult({ doc, query, onSelect }: SearchResultProps) {
  const config = getConfig();
  const [Link, setLink] = React.useState<any>(null);

  React.useEffect(() => {
    const loadNext = async () => {
      try {
        const nextLink = await import('next/link');
        setLink(() => nextLink.default);
      } catch (error) {
        console.warn('Next.js not available, using fallback link');
      }
    };
    loadNext();
  }, []);

  const href = `${config.docs.baseUrl || '/docs'}/${doc.slug}`;

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const ResultContent = () => (
    <div className="px-4 py-3 hover:bg-accent cursor-pointer">
      <div className="font-medium text-sm" 
           dangerouslySetInnerHTML={{ __html: highlightMatch(doc.meta.title) }} />
      {doc.meta.description && (
        <div className="text-xs text-muted-foreground mt-1"
             dangerouslySetInnerHTML={{ __html: highlightMatch(doc.meta.description) }} />
      )}
      {doc.meta.tags && doc.meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {doc.meta.tags.map((tag) => (
            <span
              key={tag}
              className="px-1 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
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
      <a href={href} onClick={onSelect} className="block">
        <ResultContent />
      </a>
    );
  }

  return (
    <Link href={href} onClick={onSelect} className="block">
      <ResultContent />
    </Link>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}