"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, PanelLeftCloseIcon, PanelLeftOpenIcon, ShieldCheck, Sparkles, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useShell } from "@/components/layout/shell-context";
import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";
import { useMediaQuery } from "@/hooks/use-media-query";
import { clearDemoSession } from "@/lib/demo/demo-session";

export function Sidebar() {
  const { panel, hotel, branch, sidebarCollapsed, toggleSidebar } = useShell();
  const belowLg = useMediaQuery("(max-width: 1023px)");
  const router = useRouter();

  // Desktop sidebar is always compact on tablet widths; toggle applies on lg+.
  const compact = sidebarCollapsed || belowLg;

  // Demo phase: the old cross-panel shortcut is replaced by the demo user
  // switcher — hotel roles can no longer jump into the platform control plane.
  const handleSwitchUser = () => {
    clearDemoSession();
    router.push("/login");
  };

  const brandName = panel === "admin" ? "HotelSync Control Plane" : hotel.name;
  const brandSubtitle =
    panel === "admin" ? "Internal Super Admin" : branch?.name ?? "All branches";

  const brand = (
    <div className={cn("flex min-w-0 items-center gap-2.5", compact && "justify-center")}>
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        {panel === "admin" ? (
          <ShieldCheck className="size-4" />
        ) : (
          <Building2 className="size-4" />
        )}
      </span>
      {!compact && (
        <span className="hidden min-w-0 flex-col lg:flex">
          <span className="truncate text-sm font-semibold">{brandName}</span>
          <span className="truncate text-[0.6875rem] text-muted-foreground">
            {brandSubtitle}
          </span>
        </span>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Application sidebar"
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out md:flex",
        sidebarCollapsed ? "w-[76px]" : "md:w-[76px] lg:w-[264px]",
      )}
    >
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-3">
        {compact ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={panel === "admin" ? "/admin" : "/dashboard"}
                aria-label={brandName}
                className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {panel === "admin" ? (
                  <ShieldCheck className="size-4" />
                ) : (
                  <Building2 className="size-4" />
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{brandName}</TooltipContent>
          </Tooltip>
        ) : (
          brand
        )}
      </div>

      <SidebarNav collapsed={sidebarCollapsed} />

      <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border p-3">
        {panel === "hotel" && !compact && (
          <div className="hidden items-center gap-2 rounded-lg bg-sidebar-accent/60 px-2.5 py-2 lg:flex">
            <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate text-[0.6875rem] text-muted-foreground">
              Enterprise Plan · {hotel.branchesCount} branches
            </span>
            <Badge variant="outline" className="ml-auto hidden shrink-0 xl:inline-flex">
              Active
            </Badge>
          </div>
        )}

        <div className={cn("flex items-center gap-2", compact && "justify-center")}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSwitchUser}
            className={cn(
              sidebarCollapsed ? "hidden" : "hidden flex-1 lg:flex lg:px-0",
            )}
          >
            <UsersIcon aria-hidden="true" />
            <span className="truncate">Switch user</span>
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!sidebarCollapsed}
                className="hidden shrink-0 lg:inline-flex"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpenIcon />
                ) : (
                  <PanelLeftCloseIcon />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
