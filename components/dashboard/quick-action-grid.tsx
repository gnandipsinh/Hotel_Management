"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShell } from "@/components/layout/shell-context";
import type { CustomerModuleKey, ModuleKey } from "@/types/navigation";

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Hidden when this module is not enabled for the hotel. */
  moduleKey: ModuleKey;
}

export function QuickActionGrid({
  title = "Quick actions",
  actions,
}: {
  title?: string;
  actions: QuickAction[];
}) {
  const { enabledModules, panel } = useShell();

  const visible =
    panel === "admin"
      ? actions
      : actions.filter((action) =>
          enabledModules.includes(action.moduleKey as CustomerModuleKey),
        );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {visible.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border bg-card p-3 text-center text-xs font-medium outline-none transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
