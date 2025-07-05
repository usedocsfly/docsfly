import { Navigation } from "@/components/navigation";
import { generateNavigation } from "@/lib/docs";
import { headers } from "next/headers";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = await generateNavigation();

  return (
    <div className="flex">
      <aside className="w-64 min-h-screen">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Documentation</h2>
          <Navigation items={navigation} />
        </div>
      </aside>
      <div className="flex-1 min-h-screen">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
