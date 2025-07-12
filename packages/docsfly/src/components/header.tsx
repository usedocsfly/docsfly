import React from "react";
import { loadConfig } from "../config";
import Link from "next/link";
import { Button } from "./ui/button";

export async function Header() {
  const config = loadConfig();

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
