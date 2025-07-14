"use client";

import React from "react";
import type { SerializeResult } from "next-mdx-remote-client/serialize";
import { Markdown } from "../markdown";
import { PrevNext } from "./prev-next";
import type { DocNavItem } from "../../types";

interface DocsPageProps {
  children: SerializeResult;
  title?: string;
  description?: string;
  lastUpdated?: string;
  tags?: string[];
  className?: string;
  prevNext?: {
    prev: DocNavItem | null;
    next: DocNavItem | null;
  };
}

export function DocsPage({
  children,
  title,
  description,
  lastUpdated,
  tags,
  className = "",
  prevNext,
}: DocsPageProps) {
  return (
    <article className={`max-w-none mb-8 px-4 ${className}`}>
      {title && (
        <header className="mb-8 pb-6 border-b border-border">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
          {description && (
            <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {lastUpdated && (
              <span className="flex items-center gap-1">
                📅 Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </span>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
      )}
      <div className="prose dark:prose-invert text-foreground leading-7 [&>*]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:mb-3 [&>p]:mb-4 [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>ul]:pl-6 [&>ol]:pl-6 [&>li]:mb-1">
        <Markdown>{children}</Markdown>
      </div>

      {prevNext && <PrevNext prev={prevNext.prev} next={prevNext.next} />}
    </article>
  );
}
