"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { NavItem } from "@/types/navigation";

export interface SidebarNavItemProps {
  item: NavItem;
  /** User-collapsed state of the desktop sidebar. */
  collapsed: boolean;
  /** True when labels are not visible (collapsed desktop or compact tablet). */
  labelsHidden: boolean;
  expandable: boolean;
  open: boolean;
  onToggle: () => void;
}

function badgeClassFor(variant: NavItem["badgeVariant"]): string {
  switch (variant) {
    case "success":
      return "border-transparent bg-success/15 text-success";
    case "warning":
      return "border-transparent bg-warning/20 text-warning-foreground";
    case "destructive":
      return "bg-destructive/10 text-destructive";
    case "outline":
      return "border-border text-foreground";
    default:
      return "bg-primary/10 text-primary";
  }
}

export function SidebarNavItem({
  item,
  collapsed,
  labelsHidden,
  expandable,
  open,
  onToggle,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const matches = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const selfActive = matches(item.href);
  const childActive = item.children?.some((child) => matches(child.href)) ?? false;
  const isActive = item.children?.length ? childActive || selfActive : selfActive;

  const link = (
    <Link
      href={item.disabled ? "#" : item.href}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={item.disabled || undefined}
      onClick={item.disabled ? (event) => event.preventDefault() : undefined}
      className={cn(
        "group relative flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        !collapsed && "md:justify-center md:px-0 lg:justify-start lg:px-3",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        item.disabled && "pointer-events-none opacity-50",
      )}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 h-5 w-1 -translate-x-1/2 rounded-full bg-sidebar-primary"
        />
      )}
      <Icon className="size-4 shrink-0" aria-hidden="true" />

      {collapsed ? (
        <span className="sr-only">{item.title}</span>
      ) : (
        <span className="hidden truncate lg:inline">{item.title}</span>
      )}

      {item.badge !== undefined && !collapsed && (
        <Badge
          variant={item.badgeVariant === "destructive" ? "destructive" : item.badgeVariant === "outline" ? "outline" : "secondary"}
          className={cn(
            "ml-auto hidden border-transparent lg:inline-flex",
            badgeClassFor(item.badgeVariant),
          )}
        >
          {item.badge}
        </Badge>
      )}

      {!expandable && (
        <ChevronRightIcon
          aria-hidden="true"
          className={cn(
            "ml-auto hidden size-3.5 shrink-0 text-sidebar-foreground/40 transition-transform group-hover:translate-x-0.5 lg:block",
            collapsed && "hidden",
          )}
        />
      )}
    </Link>
  );

  const body = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        <div className="min-w-0 flex-1">{link}</div>
        {expandable && !collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${item.title} menu`}
            onClick={onToggle}
            className="mr-1 hidden shrink-0 lg:inline-flex"
          >
            <ChevronRightIcon
              className={cn("size-3.5 transition-transform", open && "rotate-90")}
            />
          </Button>
        )}
      </div>

      {expandable && open && !collapsed && (
        <ul className="ml-5 hidden flex-col gap-1 border-l border-sidebar-border/70 pl-3 lg:flex">
          {item.children?.map((child) => {
            const ChildIcon = child.icon;
            const childActive = matches(child.href);
            return (
              <li key={child.id}>
                <Link
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[0.8125rem] outline-none transition-colors",
                    "focus-visible:ring-3 focus-visible:ring-ring/50",
                    childActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <ChildIcon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{child.title}</span>
                  {child.badge !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">{child.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  if (labelsHidden) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return body;
}
