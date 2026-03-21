"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AnalyzeSidebarContentProvider } from "@/contexts/analyze-sidebar-content";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnalyzeSidebarContentProvider>
      <SidebarProvider
        className="min-h-svh font-sans"
        style={
          {
            "--sidebar-width": "15rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="flex min-h-svh flex-col bg-background">
          <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-2 md:hidden">
            <SidebarTrigger />
            <span className="text-muted-foreground text-xs">Menu</span>
          </header>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AnalyzeSidebarContentProvider>
  );
}
