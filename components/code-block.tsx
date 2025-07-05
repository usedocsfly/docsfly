"use client";

import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ShikiHighlighter } from "react-shiki";
import { Badge } from "./ui/badge";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const writeTextToClipboard = async () => {
    await navigator.clipboard.writeText(children as string);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative mb-4 rounded-lg overflow-hidden border">
      {filename && (
        <div className="flex justify-between items-center bg-secondary/50 px-4 py-2">
          <span className="text-sm font-mono text-secondary-foreground">
            {filename}
          </span>

          <Button variant="ghost" size="icon" onClick={writeTextToClipboard}>
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
      )}
      {!filename && language && (
        <div className="flex justify-between items-center bg-secondary/50 px-4 py-2">
          <span className="text-sm font-mono text-secondary-foreground">
            {language}
          </span>

          <Button variant="ghost" size="icon" onClick={writeTextToClipboard}>
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
      )}
      <div className="relative">
        <pre className="bg-secondary/80 overflow-x-auto">
          <ShikiHighlighter
            theme="material-theme-darker"
            showLanguage={false}
            className="rounded-t-0 !font-mono"
            language={language}
          >
            {children as string}
          </ShikiHighlighter>
        </pre>
        {language && (
          <div className="absolute top-2 right-2">
            <Badge>{language}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}

interface InlineCodeProps {
  children: ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="bg-secondary/50 text-secondary-foreground p-1.5 text-sm rounded font-mono">
      {children}
    </code>
  );
}
