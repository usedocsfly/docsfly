"use client";

import React, { useState, useEffect } from "react";
import { Doc, DocsflyConfig } from "../types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchProps {
  docs: Doc[];
  config: DocsflyConfig;
  onSelect?: (doc: Doc) => void;
  placeholder?: string;
  className?: string;
}

export function Search({
  docs,
  config,
  onSelect,
  placeholder = "Search documentation...",
  className = "",
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 0) {
      const filtered = docs.filter(
        (doc) =>
          doc.meta.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.meta.description?.toLowerCase().includes(query.toLowerCase()) ||
          doc.meta.tags?.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ) ||
          (doc.content && typeof doc.content === 'string' && 
           (doc.content as any).toLowerCase().includes(query.toLowerCase()))
      );
      // Sort filtered results with title matches first
      const sorted = filtered.sort((a, b) => {
        const aHasTitle = a.meta.title.toLowerCase().includes(query.toLowerCase());
        const bHasTitle = b.meta.title.toLowerCase().includes(query.toLowerCase());
        
        if (aHasTitle && !bHasTitle) return -1;
        if (!aHasTitle && bHasTitle) return 1;
        return 0;
      });
      
      setFilteredDocs(sorted);
      setIsOpen(true);
    } else {
      setFilteredDocs([]);
      setIsOpen(false);
    }
  }, [query, docs]);

  const handleSelect = (doc: Doc) => {
    setQuery("");
    setIsOpen(false);
    onSelect?.(doc);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredDocs.length > 0) {
      // Navigate to the best match (first in sorted list, prioritizing title matches)
      const bestMatch = filteredDocs[0];
      const href = `${config.docs.baseUrl || "/docs"}/${bestMatch.slug}`;
      router.push(href);
      handleSelect(bestMatch);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center p-1 border rounded-md bg-background">
        <SearchIcon className="w-4 h-4 ml-2 text-muted-foreground" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 text-sm bg-transparent outline-none"
          placeholder={placeholder}
        />
      </div>

      {isOpen && filteredDocs.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
          {filteredDocs.map((doc) => (
            <SearchResult
              key={doc.slug}
              config={config}
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
  config: DocsflyConfig;
  query: string;
  onSelect: () => void;
}

function SearchResult({ doc, config, query, onSelect }: SearchResultProps) {
  const href = `${config.docs.baseUrl || "/docs"}/${doc.slug}`;

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const ResultContent = () => (
    <div className="px-4 py-3 hover:bg-accent cursor-pointer">
      <div
        className="font-medium text-sm"
        dangerouslySetInnerHTML={{ __html: highlightMatch(doc.meta.title) }}
      />
      {doc.meta.description && (
        <div
          className="text-xs text-muted-foreground mt-1"
          dangerouslySetInnerHTML={{
            __html: highlightMatch(doc.meta.description),
          }}
        />
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
