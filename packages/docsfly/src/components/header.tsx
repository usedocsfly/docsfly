"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface Config {
  header?: {
    title?: string;
    logo?: string;
    showSearch?: boolean;
    navigation?: Array<{ href: string; label: string; }>;
  };
}

export function Header() {
  const [config, setConfig] = useState<Config>({});

  useEffect(() => {
    // Load config on client side
    const loadClientConfig = async () => {
      try {
        const { loadConfig } = await import("../config");
        const loadedConfig = loadConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };
    loadClientConfig();
  }, []);

  return (
    <header className="border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            {config.header && config.header.logo && (
              <img
                src={config.header.logo}
                alt="Logo"
                className="h-8 w-8 mr-3"
              />
            )}
            <h1 className="text-xl font-semibold">
              {config.header?.title || "Docsfly"}
            </h1>
          </div>

          {/* Navigation */}
          {config.header && config.header.navigation && (
            <nav className="hidden md:flex gap-4">
              {config.header.navigation.map((item, index) => (
                <Button asChild key={index} variant="ghost">
                  <Link
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          )}

          {/* Search */}
          {config.header && config.header.showSearch && (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search docs..."
                className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
