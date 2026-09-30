"use client";

import { useRouter } from "next/navigation";
import { Building2, ShieldCheck, UsersIcon } from "lucide-react";
import { useShell } from "@/components/layout/shell-context";
import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";
import { clearDemoSession } from "@/lib/demo/demo-session";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function MobileSidebar() {
  const { panel, hotel, branch, mobileNavOpen, setMobileNavOpen } = useShell();
  const router = useRouter();

  // Demo phase: cross-panel shortcuts are replaced by the demo user switcher.
  const handleSwitchUser = () => {
    clearDemoSession();
    setMobileNavOpen(false);
    router.push("/login");
  };

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetContent
        side="left"
        aria-label="Mobile navigation"
        className="w-[86%] max-w-xs gap-0 bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetHeader className="h-14 flex-row items-center gap-2.5 border-b border-sidebar-border px-4">
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
          <div className="min-w-0 flex-1 text-left">
            <SheetTitle className="truncate text-sm">
              {panel === "admin" ? "HotelSync Control Plane" : hotel.name}
            </SheetTitle>
            <p className="truncate text-[0.6875rem] text-muted-foreground">
              {panel === "admin" ? "Internal Super Admin" : branch?.name}
            </p>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <SidebarNav
            collapsed={false}
            isMobile
            onNavigate={() => setMobileNavOpen(false)}
          />
        </div>

        <div className="border-t border-sidebar-border p-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSwitchUser}
            className="w-full justify-between"
          >
            <span>Switch demo user</span>
            <UsersIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
