"use client";

import * as React from "react";
import { useShell } from "@/components/layout/shell-context";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { MobileSidebar } from "@/components/layout/sidebar/mobile-sidebar";
import { Topbar } from "@/components/layout/topbar";

/**
 * Reusable application shell shared by the hotel operations panel and the
 * internal platform control panel. Wrap it with a ShellProvider first.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { panel } = useShell();

  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileSidebar />

      <div
        data-panel={panel}
        className="flex min-w-0 flex-1 flex-col"
      >
        <Topbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
