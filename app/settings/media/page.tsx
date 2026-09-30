import { DemoRouteGuard } from "@/components/demo/demo-route-guard";
import { ShellProvider } from "@/components/layout/shell-context";
import { AppShell } from "@/components/layout/app-shell";
import { MediaLibraryView } from "@/components/media/media-library-view";

/**
 * Phase 7 — Media Library. A dedicated route (specific route wins over the
 * `[...slug]` module catch-all) so the media UI is a first-class page.
 * Phase 8: wrapped in the demo route guard (settings module access).
 */
export default function MediaLibraryPage() {
  return (
    <DemoRouteGuard>
      <ShellProvider initialPanel="hotel">
        <AppShell>
          <MediaLibraryView />
        </AppShell>
      </ShellProvider>
    </DemoRouteGuard>
  );
}
