"use client";

import React, { useState, useEffect } from "react";
import { DocsflyConfig, Doc, DocNavItem } from "../types";
import { Search } from "./search";
import { VersionSelector } from "./version-selector";
import { Button } from "./ui/button";
import Link from "next/link";
import { NavigationItem } from "./navigation";

interface MobileMenuProps {
  config: DocsflyConfig;
  docs?: Doc[];
  navigation?: DocNavItem[];
}

export function MobileMenu({
  config,
  docs = [],
  navigation = [],
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden pr-2 hover:bg-muted rounded-md transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleClose}
          />

          <div className="fixed inset-y-0 left-0 w-80 bg-background border-r z-50 md:hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {config.header?.showSearch && docs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                      Search
                    </h3>
                    <Search
                      docs={docs}
                      config={config}
                      placeholder="Search docs..."
                      onSelect={handleClose}
                    />
                  </div>
                )}

                {config.versions?.enabled && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                      Version
                    </h3>
                    <VersionSelector config={config} />
                  </div>
                )}

                {config.header?.navigation && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                      Navigation
                    </h3>
                    <nav className="space-y-2">
                      {config.header.navigation.map((item, index) => (
                        <Button
                          asChild
                          key={index}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleClose}
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </Button>
                      ))}
                    </nav>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                    {config.docs.sidebar?.title || "Documentation"}
                  </h3>
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <NavigationItem
                        key={
                          item.href +
                          item.title.replace(/\s+/g, "-").toLowerCase()
                        }
                        item={item}
                      />
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
