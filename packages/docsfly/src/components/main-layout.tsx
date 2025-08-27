import { ReactNode } from "react";
import { Header } from "./header";
import { ThemeProvider } from "./ui/theme-provider";
import { InitHotReloader } from "../hot-reload/init-reloader";
import { generateNavigation } from "../docs";

export async function MainLayout({ children }: { children: ReactNode }) {
  InitHotReloader();

  const navigation = await generateNavigation();
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header navigation={navigation} />
        {children}
      </div>
    </ThemeProvider>
  );
}
