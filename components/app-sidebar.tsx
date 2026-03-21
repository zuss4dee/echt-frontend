"use client";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { useAnalyzeSidebarContent } from "@/contexts/analyze-sidebar-content";

/**
 * Shell for the analyze route sidebar. Actual body is supplied by
 * `app/analyze/page.tsx` via `useAnalyzeSidebarContent().setSidebarContent`
 * so landing vs result/workspace can differ without prop drilling through the layout.
 */
export function AppSidebar() {
  const { sidebarContent } = useAnalyzeSidebarContent();

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarContent className="gap-0 overflow-x-hidden p-0">
        {sidebarContent}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
