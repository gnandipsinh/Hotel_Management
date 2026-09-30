import { notFound } from "next/navigation";
import {
  findNavItemByPath,
  hotelNavigationConfig,
  internalAdminNavigationConfig,
} from "@/config/navigation";
import { DemoRouteGuard } from "@/components/demo/demo-route-guard";
import { ShellProvider } from "@/components/layout/shell-context";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePreview } from "@/components/module/module-preview";

interface ModuleRouteProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Catch-all route: resolves any valid navigation href across both panels to a
 * module placeholder page. Unknown paths render Next's not-found page.
 * Phase 8: guarded — requires a demo session with access to the resolved
 * panel/module (role-based demo route protection).
 */
export default async function ModuleRoute({ params }: ModuleRouteProps) {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const isAdminRoute = slug[0] === "admin";
  const config = isAdminRoute ? internalAdminNavigationConfig : hotelNavigationConfig;
  const lookup = findNavItemByPath(config, pathname);

  // Only exact navigation hrefs resolve; deeper unknown paths 404.
  if (!lookup || lookup.item.href !== pathname) {
    notFound();
  }

  return (
    <DemoRouteGuard>
      <ShellProvider initialPanel={isAdminRoute ? "admin" : "hotel"}>
        <AppShell>
          <ModulePreview
            title={lookup.item.title}
            description={
              lookup.section.title
                ? `${lookup.section.title} · ${lookup.item.href}`
                : lookup.item.href
            }
            moduleKey={lookup.item.moduleKey}
            requiredPermission={lookup.item.requiredPermission}
          />
        </AppShell>
      </ShellProvider>
    </DemoRouteGuard>
  );
}
