import React from "react";
import { loadConfig } from "../config";
import Link from "next/link";
import { Button } from "./ui/button";
import { Search } from "./search";
import { DocNavItem, getAllDocs } from "../docs";
import { VersionSelector } from "./version-selector";
import { MobileMenu } from "./mobile-menu";

export async function Header({ navigation }: { navigation: DocNavItem[] }) {
  const config = loadConfig();
  const docs = await getAllDocs();

  return (
    <header className="border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <MobileMenu config={config} docs={docs} navigation={navigation} />
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

          {/* Search & Navigation & Version Selector - Hidden on mobile */}
          {(config.header?.showSearch ||
            config.versions?.enabled ||
            config.header?.navigation) && (
            <div className="hidden md:flex items-center gap-4">
              {config.header?.navigation && (
                <nav className="flex justify-between w-fit">
                  {config.header.navigation.map((item, index) => (
                    <Button asChild key={index} variant="ghost">
                      <Link href={item.href}>{item.label}</Link>
                    </Button>
                  ))}
                </nav>
              )}

              {config.versions?.enabled && <VersionSelector config={config} />}

              {config.header?.showSearch && (
                <Search
                  docs={docs}
                  config={config}
                  placeholder="Search docs..."
                />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
