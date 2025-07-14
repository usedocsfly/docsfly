import { ReactNode } from "react";

interface BlogLayoutProps {
  children: ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  return (
      <main className="mx-auto max-w-3xl py-12">{children}</main>
  );
}
