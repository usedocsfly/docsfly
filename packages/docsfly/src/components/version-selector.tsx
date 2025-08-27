"use client";

import { useState } from "react";
import { DocsflyConfig } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "./ui/utils";

interface VersionSelectorProps {
  config: DocsflyConfig;
}

export function VersionSelector({ config }: VersionSelectorProps) {
  // temporaily disabling versions
  return null;

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (!config.versions?.enabled || !config.versions.versions.length) {
    return null;
  }

  const currentVersion = pathname.split("/")[2];

  const current =
    config.versions.versions.find((v) => v.name === currentVersion) ||
    config.versions.versions.find((v) => v.isDefault) ||
    config.versions.versions[0];

  const handleVersionSelect = (version: string) => {
    setIsOpen(false);

    router.push(`/docs/${version}`);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
          <span>{current.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={4} className="w-48 space-y-1">
        {config.versions.versions.map((version) => (
          <DropdownMenuItem
            key={version.name}
            
            onClick={() => handleVersionSelect(version.name)}
            className={`flex flex-col items-start gap-0.5 py-2 hover:bg-muted/50 transition-colors ${
              version.name === current.name ? "bg-muted font-medium" : ""
            }`}
          >
            <div
              className={cn(version.name === current.name && "font-semibold")}
            >
              {version.label}{" "}
              {version.isDefault && (
                <span className="font-medium">(Default)</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {version.name}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
