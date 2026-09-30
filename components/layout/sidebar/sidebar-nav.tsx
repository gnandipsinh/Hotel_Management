"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getVisibleNavigation, hotelNavigationConfig, internalAdminNavigationConfig } from "@/config/navigation";
import { useShell } from "@/components/layout/shell-context";
import { SidebarNavItem } from "@/components/layout/sidebar/sidebar-nav-item";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { NavItem } from "@/types/navigation";

function collectActiveAncestors(items: NavItem[], pathname: string): string[] {
  for (const item of items) {
    if (!item.children?.length) continue;
    const childActive = item.children.some(
      (child) =>
        pathname === child.href || pathname.startsWith(`${child.href}/`),
    );
    if (childActive) {
      return [item.id, ...collectActiveAncestors(item.children, pathname)];
    }
  }
  return [];
}

interface SidebarNavProps {
  /** User-collapsed state of the desktop sidebar. */
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const { panel, enabledModules } = useShell();
  const belowLg = useMediaQuery("(max-width: 1023px)");

  const baseConfig =
    panel === "admin" ? internalAdminNavigationConfig : hotelNavigationConfig;

  // Frontend preparation only — the backend enforces module access later.
  const visibleConfig = React.useMemo(
    () =>
      getVisibleNavigation({
        config: baseConfig,
        enabledModules: panel === "hotel" ? enabledModules : undefined,
      }),
    [baseConfig, enabledModules, panel],
  );

  const [overrides, setOverrides] = React.useState<Record<string, boolean>>({});

  const autoOpenIds = React.useMemo(
    () =>
      visibleConfig.sections.flatMap((section) =>
        collectActiveAncestors(section.items, pathname),
      ),
    [visibleConfig, pathname],
  );

  const isOpen = (id: string) => overrides[id] ?? autoOpenIds.includes(id);

  const toggle = (id: string) => {
    setOverrides((previous) => ({
      ...previous,
      [id]: !(previous[id] ?? autoOpenIds.includes(id)),
    }));
  };

  const labelsHidden = collapsed || belowLg;

  return (
    <nav
      aria-label="Primary navigation"
      className="flex flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto px-3 pb-6 pt-1"
    >
      {visibleConfig.sections.map((section) => (
        <div key={section.id} className="flex flex-col gap-1.5">
          {section.title && !collapsed && (
            <p className="hidden px-3 text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase lg:block">
              {section.title}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => (
              <li key={item.id}>
                <SidebarNavItem
                  item={item}
                  collapsed={collapsed}
                  labelsHidden={labelsHidden}
                  expandable={Boolean(item.children?.length)}
                  open={isOpen(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}

      {visibleConfig.sections.length === 0 && (
        <p className={cn("px-3 text-xs text-muted-foreground", collapsed && "sr-only")}>
          No modules are enabled for this hotel yet.
        </p>
      )}
    </nav>
  );
}
