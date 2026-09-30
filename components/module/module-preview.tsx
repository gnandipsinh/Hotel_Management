"use client";

import * as React from "react";
import { toast } from "sonner";
import { ConstructionIcon, InboxIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { DataState, type DataStateKind } from "@/components/states/data-state";
import { StatusBadge } from "@/components/data/status-badge";

/**
 * Placeholder for a module route that exists in navigation (and therefore has
 * valid access) but whose full UI arrives in a later phase. Demonstrates the
 * four data states every module page must support.
 */
export function ModulePreview({
  title,
  description,
  moduleKey,
  requiredPermission,
}: {
  title: string;
  description?: string;
  moduleKey: string;
  requiredPermission?: string;
}) {
  const [demoState, setDemoState] = React.useState<DataStateKind>("empty");

  return (
    <PageContainer width="wide">
      <PageHeader
        title={title}
        description={description ?? `${title} · module in development`}
        actions={
          <>
            <StatusBadge tone="primary">{moduleKey}</StatusBadge>
            {requiredPermission && (
              <StatusBadge tone="neutral">permission: {requiredPermission}</StatusBadge>
            )}
          </>
        }
      />

      <div className="mt-5 flex flex-col gap-4">
        <Card>
          <CardHeader className="flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ConstructionIcon className="size-4 text-warning" aria-hidden="true" />
              Reserved for a future phase
            </CardTitle>
            <Tabs
              value={demoState}
              onValueChange={(value) => setDemoState(value as DataStateKind)}
            >
              <TabsList className="h-8">
                <TabsTrigger value="empty" className="text-xs">
                  Empty
                </TabsTrigger>
                <TabsTrigger value="loading" className="text-xs">
                  Loading
                </TabsTrigger>
                <TabsTrigger value="error" className="text-xs">
                  Error
                </TabsTrigger>
                <TabsTrigger value="success" className="text-xs">
                  Reserved
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <DataState
              state={demoState}
              skeleton="rows"
              skeletonRows={6}
              empty={{
                icon: InboxIcon,
                title: `No ${title.toLowerCase()} yet`,
                description:
                  "This module is wired into navigation, permissions and module entitlements. Its working UI will be built in a later phase.",
                action: {
                  label: "Back to dashboard",
                  href: "/dashboard",
                },
              }}
              error={{
                title: `Unable to load ${title.toLowerCase()}`,
                description:
                  "The service for this module is not available yet. Retry when the backend phase ships.",
                onRetry: () => toast.info("Backend arrives in a later phase."),
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ConstructionIcon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold">{title} is under construction</p>
                <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Navigation, breadcrumbs, module filtering and error handling are live.
                  Business logic arrives in a later phase.
                </p>
              </div>
            </DataState>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
