"use client";

import * as React from "react";

type AnalyzeSidebarContentContextValue = {
  sidebarContent: React.ReactNode;
  setSidebarContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

const AnalyzeSidebarContentContext = React.createContext<AnalyzeSidebarContentContextValue | null>(
  null,
);

export function AnalyzeSidebarContentProvider({ children }: { children: React.ReactNode }) {
  const [sidebarContent, setSidebarContent] = React.useState<React.ReactNode>(null);

  const value = React.useMemo(
    () => ({ sidebarContent, setSidebarContent }),
    [sidebarContent, setSidebarContent],
  );

  return (
    <AnalyzeSidebarContentContext.Provider value={value}>
      {children}
    </AnalyzeSidebarContentContext.Provider>
  );
}

export function useAnalyzeSidebarContent() {
  const ctx = React.useContext(AnalyzeSidebarContentContext);
  if (!ctx) {
    throw new Error("useAnalyzeSidebarContent must be used within AnalyzeSidebarContentProvider");
  }
  return ctx;
}
