"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, Loader2Icon, ShieldAlertIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPanelRoute } from "@/config/demo";
import {
  canAccessDemoRoute,
  clearDemoSession,
  resolveDemoUser,
  useDemoHydrated,
  useDemoSession,
} from "@/lib/demo/demo-session";

/**
 * Demo route protection (NOT production RBAC).
 *
 * - Not signed in  → redirect to /login (deep links preserved via ?next=)
 * - Signed in, wrong role → inline "Access denied" screen (manual URL changes
 *   cannot open another role's panel)
 * - Signed in, correct role → render the panel
 *
 * Demo authentication only — replace with production authentication and
 * real RBAC in a later phase.
 */

function GuardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-3 px-6"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary/10">
        <Loader2Icon className="size-5 animate-spin text-primary" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold">Verifying demo session…</p>
      <p className="text-center text-xs text-muted-foreground">
        Demo authentication only — production sessions arrive in a later phase.
      </p>
    </div>
  );
}

function AccessDenied({
  roleName,
  pathname,
  panelRoute,
}: {
  roleName: string;
  pathname: string;
  panelRoute: string;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-dashed border-destructive/40 px-6 py-12 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlertIcon className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-semibold">Access denied</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Your demo role <span className="font-medium text-foreground">{roleName}</span> does not
          have access to <span className="font-medium text-foreground">{pathname}</span>. Demo role
          routes are enforced for this preview — production RBAC arrives in a later phase.
        </p>
        <div className="mt-5 flex flex-col items-stretch justify-center gap-2 sm:flex-row">
          <Button asChild size="sm" variant="default">
            <Link href={panelRoute}>
              <ArrowLeftIcon aria-hidden="true" />
              Go to my panel
            </Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              clearDemoSession();
              router.replace("/login");
            }}
          >
            <UsersIcon aria-hidden="true" />
            Switch demo user
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DemoRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useDemoHydrated();
  const session = useDemoSession();
  const user = resolveDemoUser(session);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!session || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, session, user, pathname, router]);

  if (!hydrated || !session || !user) {
    return <GuardLoading />;
  }

  if (!canAccessDemoRoute(user.role, pathname)) {
    return (
      <AccessDenied
        roleName={user.roleName}
        pathname={pathname}
        panelRoute={getPanelRoute(user.role)}
      />
    );
  }

  return <>{children}</>;
}
