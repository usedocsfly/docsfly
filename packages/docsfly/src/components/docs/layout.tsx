import { ReactNode } from "react";
import { DocNavItem } from "../../types";
import { Sidebar } from "../sidebar";
import { getConfig } from "../../config";
import { HotReloader } from "../../hot-reload/reloader";
import { generateNavigation } from "../../docs";

interface DocsLayoutProps {
  children: ReactNode;
  navigation?: DocNavItem[];
  className?: string;
}

/**
 * The top-level component for a Docsfly documentation page.
 *
 * @param children The main content of the page.
 * @param navigation Deprecated param - You don't need to provide this anymore.
 * @param className Additional CSS classes to apply to the top-level element.
 *
 * @example
 * <DocsLayout>
 *   {children as any}
 * </DocsLayout>
 */
export async function DocsLayout({
  children,
  navigation: _navigation, // For compatibility
  className = "",
}: DocsLayoutProps) {
  const config = getConfig();

  const navigation = await generateNavigation();

  return (
    <div
      className={`flex flex-1 justify-center overflow-hidden pt-8 ${className}`}
    >
      <div
        className={`flex justify-center max-w-full ${
          config.docs.compact ? "md:max-w-4xl" : "md:max-w-7xl"
        } gap-24 mx-auto w-full h-full`}
      >
        <HotReloader />
        <Sidebar navigation={navigation} className="hidden md:block" />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
