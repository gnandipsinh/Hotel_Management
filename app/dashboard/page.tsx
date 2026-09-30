import { DemoRouteGuard } from "@/components/demo/demo-route-guard";
import { ShellProvider } from "@/components/layout/shell-context";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardView } from "@/components/dashboard/dashboard-view";

/**
 * Hotel panel dashboard (moved from `/` in Phase 8 so the landing page can
 * own the root route). Protected by the demo route guard.
 */
export default function DashboardPage() {
  return (
    <DemoRouteGuard>
      <ShellProvider initialPanel="hotel">
        <AppShell>
          <DashboardView />
        </AppShell>
      </ShellProvider>
    </DemoRouteGuard>
  );
}
