import { DemoRouteGuard } from "@/components/demo/demo-route-guard";
import { ShellProvider } from "@/components/layout/shell-context";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePreview } from "@/components/module/module-preview";

/**
 * Manager panel landing (Phase 8). Placeholder shell for a role panel that
 * has no dedicated navigation entry — access is limited to the manager demo
 * role and the hotel super admin.
 */
export default function ManagerPanelPage() {
  return (
    <DemoRouteGuard>
      <ShellProvider initialPanel="hotel">
        <AppShell>
          <ModulePreview
            title="Manager Panel"
            description="Manager role panel · /manager"
            moduleKey="manager_panel"
          />
        </AppShell>
      </ShellProvider>
    </DemoRouteGuard>
  );
}
