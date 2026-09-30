"use client";

import * as React from "react";
import { BadgeHelpIcon, MenuIcon, ShieldCheckIcon } from "lucide-react";
import { useShell } from "@/components/layout/shell-context";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GlobalSearch } from "@/components/search/global-search";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { ThemeSwitcher } from "@/components/navigation/theme-switcher";
import { HotelBranchSwitcher } from "@/components/navigation/hotel-branch-switcher";
import { UserProfileMenu } from "@/components/user-menu/user-profile-menu";
import { QuickActionsMenu } from "@/components/topbar/quick-actions-menu";
import { DemoUserSwitcher } from "@/components/demo/demo-user-switcher";
import { HelpDialog } from "@/components/support/help-dialog";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { panel, hotel, mobileNavOpen, setMobileNavOpen } = useShell();
  const [helpOpen, setHelpOpen] = React.useState(false);

  return (
    <>
      <header
        aria-label="Application top bar"
        className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-1.5 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:gap-2 sm:px-4 lg:px-6"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open navigation menu"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(true)}
        >
          <MenuIcon aria-hidden="true" />
        </Button>

        <div className="hidden min-w-0 flex-1 items-center md:flex">
          <Breadcrumbs />
        </div>

        <span className="min-w-0 flex-1 truncate text-sm font-medium md:hidden">
          {panel === "admin" ? "Platform Control Plane" : hotel.name}
        </span>

        <GlobalSearch className="shrink-0" />

        <div className="hidden xl:flex">
          {panel === "hotel" ? (
            <HotelBranchSwitcher />
          ) : (
            <span className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-3.5 text-primary" aria-hidden="true" />
              Platform scope
            </span>
          )}
        </div>

        <div className="hidden lg:flex">
          <QuickActionsMenu />
        </div>

        <DemoUserSwitcher />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Help and support"
          onClick={() => setHelpOpen(true)}
          className="hidden sm:inline-flex"
        >
          <BadgeHelpIcon aria-hidden="true" />
        </Button>

        <NotificationCenter />
        <ThemeSwitcher />
        <UserProfileMenu onHelp={() => setHelpOpen(true)} />
      </header>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
