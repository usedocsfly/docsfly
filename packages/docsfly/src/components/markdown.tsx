import { MDXClient } from "next-mdx-remote-client";
import type { SerializeResult } from "next-mdx-remote-client/serialize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ShikiHighlighter from "react-shiki";
import { cn } from "./ui/utils";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function DocsflyAlert({
  className,
  variant = "default",
  children,
  title,
  description,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "destructive";
  title?: string;
  description?: string;
}) {
  return (
    <Alert
      className={cn("my-4 not-prose", className)}
      variant={variant}
      {...props}
    >
      {variant === "destructive" ? <AlertCircleIcon /> : <Info />}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}

export const markdownComponents = {
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <Link
      href={(props as any).href as string | "#"}
      className={cn(
        "text-primary/90 underline underline-offset-4 transition-all hover:text-primary",
        className
      )}
      {...props}
    />
  ),
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "font-heading mt-2 scroll-m-20 text-4xl font-bold",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "font-heading mt-12 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  p: ({ children, ...props }: { children?: React.ReactNode }) => (
    <p className="mb-6 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  pre: ({ children, ...props }: { children?: React.ReactNode }) => (
    <pre className="overflow-x-auto my-6 !p-0" {...props}>
      {children}
    </pre>
  ),
  code: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => {
    const language = props.className?.replace("language-", "");

    // Inline code (no language class)
    if (!language) {
      return (
        <code
          className="bg-muted py-0.5 px-1 rounded text-sm font-mono code-block"
          {...props}
        >
          {children}
        </code>
      );
    }

    // Code block with syntax highlighting
    return (
      <div className="bg-secondary rounded-md">
        <ShikiHighlighter language={language} theme="slack-dark">
          {children as string}
        </ShikiHighlighter>
      </div>
    );
  },
  ul: ({ children, ...props }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-6 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children?: React.ReactNode }) => (
    <li {...props}>{children}</li>
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="not-prose my-6 w-full overflow-y-auto">
      <Table {...props} />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <TableHeader>{props.children}</TableHeader>
  ),
  tbody: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <TableBody {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <TableRow {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <TableHead {...props} />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <TableCell {...props} />
  ),
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Alert: DocsflyAlert,
};

export function Markdown({ children }: { children: SerializeResult }) {
  // Handle the union type - SerializeResult can have either compiledSource or error
  if ("error" in children) {
    return <div>Error rendering MDX: {children.error.message}</div>;
  }

  const { compiledSource, frontmatter, scope } = children;
  return (
    <MDXClient
      compiledSource={compiledSource}
      frontmatter={frontmatter}
      scope={scope}
      components={markdownComponents}
    />
  );
}
