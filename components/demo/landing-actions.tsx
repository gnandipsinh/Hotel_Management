"use client";

import Link from "next/link";
import { ArrowRightIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { getPanelRoute } from "@/config/demo";
import {
  clearDemoSession,
  resolveDemoUser,
  useDemoSession,
} from "@/lib/demo/demo-session";
import { Button } from "@/components/ui/button";

/**
 * Session-aware landing CTAs: anonymous visitors get the demo sign-in entry
 * points; a signed-in demo user gets a shortcut back to their own panel.
 */
export function LandingActions() {
  const session = useDemoSession();
  const user = resolveDemoUser(session);

  if (session && user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href={getPanelRoute(user.role)}>
            Continue as {user.name}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
        <Button
          type="button"
          size="lg"
          variant="ghost"
          onClick={() => {
            clearDemoSession();
            toast.success("Signed out of the demo session.");
          }}
        >
          <LogOutIcon aria-hidden="true" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild size="lg">
        <Link href="/login">
          Open demo console
          <ArrowRightIcon aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/login?next=/admin">Platform control plane</Link>
      </Button>
    </div>
  );
}
