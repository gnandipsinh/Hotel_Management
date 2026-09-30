"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleHelpIcon,
  LogOutIcon,
  MapPinIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShell } from "@/components/layout/shell-context";
import { clearDemoSession } from "@/lib/demo/demo-session";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/**
 * User profile menu. Phase 8: "Log out" clears the demo session and returns
 * to the login page (demo authentication only — real sessions arrive later).
 */
export function UserProfileMenu({ onHelp }: { onHelp: () => void }) {
  const { user, hotel, branch, branches, setBranchId, panel } = useShell();
  const router = useRouter();

  const handleSwitchUser = () => {
    clearDemoSession();
    router.push("/login");
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
          variant="ghost"
          aria-label={`Open user menu for ${user.name}`}
          className="h-9 gap-2 px-1.5 sm:px-2"
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-36 flex-col items-start leading-none lg:flex">
            <span className="truncate text-xs font-medium">{user.name}</span>
            <span className="truncate text-[0.6875rem] text-muted-foreground">
              {user.roleName}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge variant="secondary" className="h-4 px-1.5 text-[0.625rem]">
                  {user.roleName}
                </Badge>
                {panel === "hotel" && (
                  <span className="truncate text-[0.625rem] text-muted-foreground">
                    {hotel.name} · {branch?.name}
                  </span>
                )}
                {panel === "admin" && (
                  <span className="text-[0.625rem] text-muted-foreground">
                    Platform scope
                  </span>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <UserIcon aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <SettingsIcon aria-hidden="true" />
            Account settings
          </Link>
        </DropdownMenuItem>

        {panel === "hotel" && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <MapPinIcon aria-hidden="true" />
              Switch branch
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {branches.map((branchOption) => (
                <DropdownMenuItem
                  key={branchOption.id}
                  onSelect={() => setBranchId(branchOption.id)}
                  aria-checked={branchOption.id === branch?.id}
                >
                  <span className="truncate">{branchOption.name}</span>
                  {branchOption.id === branch?.id && (
                    <span className="ml-auto text-primary" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        <DropdownMenuItem onSelect={onHelp}>
          <CircleHelpIcon aria-hidden="true" />
          Help &amp; support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleSwitchUser}>
          <UsersIcon aria-hidden="true" />
          Switch demo user
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOutIcon aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
