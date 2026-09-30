import { DemoRouteGuard } from "@/components/demo/demo-route-guard";
import { ShellProvider } from "@/components/layout/shell-context";
import { AppShell } from "@/components/layout/app-shell";
import { AdminView } from "@/components/admin/admin-view";

/**
 * Platform control plane — demo-protected: only the platform super admin
 * demo role may open admin routes.
 */
export default function AdminPage() {
  return (
    <DemoRouteGuard>
      <ShellProvider initialPanel="admin">
        <AppShell>
          <AdminView />
        </AppShell>
      </ShellProvider>
    </DemoRouteGuard>
  );
}
