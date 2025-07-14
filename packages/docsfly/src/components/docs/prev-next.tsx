"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DocNavItem } from "../../types";

interface PrevNextProps {
  prev: DocNavItem | null;
  next: DocNavItem | null;
  className?: string;
}

export function PrevNext({ prev, next, className = "" }: PrevNextProps) {
  return (
    <nav
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border ${className}`}
    >
      <div className="w-full">
        {prev && (
          <Link
            href={prev.href}
            className="group inline-flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors w-full"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Previous
              </div>
              <div className="text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors">
                {prev.title}
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="w-full flex justify-end">
        {next && (
          <Link
            href={next.href}
            className="group inline-flex items-center justify-end gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors w-full"
          >
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Next
              </div>
              <div className="text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors">
                {next.title}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        )}
      </div>
    </nav>
  );
}
