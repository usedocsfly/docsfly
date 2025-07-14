"use client";

import { useState } from 'react';
import { DocsflyConfig } from '../types';

interface VersionSelectorProps {
  config: DocsflyConfig;
  currentVersion?: string;
  onVersionChange?: (version: string) => void;
}

export function VersionSelector({ config, currentVersion, onVersionChange }: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!config.versions?.enabled || !config.versions.versions.length) {
    return null;
  }

  const current = config.versions.versions.find(v => v.name === currentVersion) || 
                  config.versions.versions.find(v => v.isDefault) ||
                  config.versions.versions[0];

  const handleVersionSelect = (version: string) => {
    setIsOpen(false);
    onVersionChange?.(version);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
      >
        <span>{current.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg z-20">
            <div className="py-1">
              {config.versions.versions.map((version) => (
                <button
                  key={version.name}
                  onClick={() => handleVersionSelect(version.name)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors ${
                    version.name === current.name ? 'bg-muted font-medium' : ''
                  }`}
                >
                  <div>
                    <div>{version.label}</div>
                    {version.isDefault && (
                      <div className="text-xs text-muted-foreground">Default</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}