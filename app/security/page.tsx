import { DemoRouteGuard } from "@/components/demo/demo-route-guard";
import { ShellProvider } from "@/components/layout/shell-context";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePreview } from "@/components/module/module-preview";

/**
 * Security panel landing (Phase 8). Placeholder shell for a role panel that
 * has no dedicated navigation entry — access is limited to the security demo
 * role and the hotel super admin.
 */
export default function SecurityPanelPage() {
  return (
    <DemoRouteGuard>
      <ShellProvider initialPanel="hotel">
        <AppShell>
          <ModulePreview
            title="Security Panel"
            description="Security role panel · /security"
            moduleKey="security_panel"
          />
        </AppShell>
      </ShellProvider>
    </DemoRouteGuard>
  );
}
