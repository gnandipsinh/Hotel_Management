"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ChevronDownIcon, FlaskConicalIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { DEMO_USER_GROUPS, getPanelRoute, type DemoUser } from "@/config/demo";
import {
  clearDemoSession,
  createDemoSession,
  resolveDemoUser,
  useDemoSession,
} from "@/lib/demo/demo-session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * DEMO-ONLY topbar switcher (development/demo functionality — marked with
 * `data-demo-switcher` so it is trivial to locate and remove later).
 *
 * Switching clears the current demo session, creates the new one and
 * redirects to the new user's panel.
 */
export function DemoUserSwitcher() {
  const session = useDemoSession();
  const user = resolveDemoUser(session);
  const router = useRouter();

  if (!session || !user) return null;

  const handleSwitch = (target: DemoUser) => {
    if (target.id === user.id) return;
    createDemoSession(target);
    toast.success(`Switched to ${target.name}`, { description: target.roleName });
    router.push(getPanelRoute(target.role));
  };

  const handleLogout = () => {
    clearDemoSession();
    toast.success("Signed out of the demo session.");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden lg:inline-flex"
          aria-label="Switch demo user"
          data-demo-switcher="true"
        >
          <FlaskConicalIcon className="size-3.5 text-primary" aria-hidden="true" />
          <span className="max-w-32 truncate">{user.roleName}</span>
          <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="max-h-[70vh] w-72 overflow-y-auto p-1">
        <DropdownMenuLabel className="px-2 py-1.5 text-[0.6875rem] text-muted-foreground">
          Demo user switcher · development only
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {DEMO_USER_GROUPS.map((group) => (
          <React.Fragment key={group.id}>
            <DropdownMenuLabel className="px-2 py-1 text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.label}
            </DropdownMenuLabel>
            {group.users.map((demoUser) => (
              <DropdownMenuItem
                key={demoUser.id}
                onSelect={() => handleSwitch(demoUser)}
                aria-checked={demoUser.id === user.id}
              >
                <span className="flex min-w-0 flex-col items-start">
                  <span className="truncate text-xs">{demoUser.name}</span>
                  <span className="truncate text-[0.6875rem] text-muted-foreground">
                    {demoUser.roleName}
                  </span>
                </span>
                {demoUser.id === user.id && (
                  <CheckIcon className="ml-auto size-3.5 shrink-0 text-primary" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}

        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOutIcon aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
