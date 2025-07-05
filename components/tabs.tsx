"use client";

import type { ReactNode } from "react";
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
}

export function Tabs({ items, defaultTab }: TabsProps) {
  return (
    <ShadcnTabs
      defaultValue={defaultTab || items[0]?.id}
      className="mb-6 !gap-0"
    >
      <TabsList className="!mb-2 bg-muted/50 w-fit">
        {items.map((item) => (
          <TabsTrigger key={item.id} value={item.id} className="px-[25px]">
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id}>
          {item.content}
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
}
