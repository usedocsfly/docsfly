import { ReactNode } from "react";
import { Header } from "./header";
import { ClientLayout } from "./client-layout";

export async function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />
        {children}
      </div>
    </ClientLayout>
  );
}
