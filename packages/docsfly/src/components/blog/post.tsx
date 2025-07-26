"use client";

import { BlogPost, DocsflyConfig } from "../../types";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { Markdown } from "../markdown";

interface BlogPostProps {
  post: BlogPost;
  config: DocsflyConfig;
  isExcerpt?: boolean;
}

export function BlogPostComponent({ post, config, isExcerpt = false }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAuthorInfo = (authorKey?: string) => {
    if (!authorKey || !config.blog?.authors) {
      return { name: authorKey || "Anonymous" };
    }

    return config.blog.authors[authorKey] || { name: authorKey };
  };

  const author = getAuthorInfo(post.meta.author);

  return (
    <article
      className={cn("max-w-none", isExcerpt && "rounded-2xl bg-secondary p-6")}
    >
      {!isExcerpt && (
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      )}

      {post.meta.image && (
        <div className="mb-6">
          <img
            src={post.meta.image}
            alt={post.meta.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">
          {isExcerpt ? (
            <a
              href={`${config.blog?.baseUrl || "/blog"}/${post.slug}`}
              className="hover:text-primary transition-colors"
            >
              {post.meta.title}
            </a>
          ) : (
            post.meta.title
          )}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            {author.image_url && (
              <img
                src={author.image_url}
                alt={author.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{author.name}</span>
            {author.title && <span>• {author.title}</span>}
          </div>

          {post.meta.date && (
            <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
          )}
        </div>

        {post.meta.tags && post.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.meta.description && (
          <p className="text-lg text-muted-foreground">
            {post.meta.description}
          </p>
        )}
      </header>

      {isExcerpt ? (
        <div>
          <p>{post.excerpt}</p>
          <a
            href={`${config.blog?.baseUrl || "/blog"}/${post.slug}`}
            className="inline-flex items-center text-primary hover:underline mt-4"
          >
            Read more →
          </a>
        </div>
      ) : (
        <div className="prose prose-neutral dark:prose-invert">
          <Markdown>{post.content}</Markdown>
        </div>
      )}
    </article>
  );
}
