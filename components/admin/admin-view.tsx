"use client";

import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import {
  BlocksIcon,
  BuildingIcon,
  CreditCardIcon,
  FlagIcon,
  HotelIcon,
  LifeBuoyIcon,
  PlusIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { QuickActionGrid, type QuickAction } from "@/components/dashboard/quick-action-grid";
import { ResponsiveTable, type ResponsiveColumn } from "@/components/data/responsive-table";
import { StatusBadge } from "@/components/data/status-badge";
import {
  MOCK_ADMIN_KPIS,
  MOCK_PLATFORM_AUDIT,
  MOCK_SUPPORT_TICKETS,
} from "@/lib/mock-dashboard";
import type { AuditEvent, SupportTicket } from "@/types/dashboard";

const KPI_ICONS: Record<string, LucideIcon> = {
  hotels: BuildingIcon,
  subscriptions: CreditCardIcon,
  tickets: LifeBuoyIcon,
  uptime: ShieldCheckIcon,
  branches: BlocksIcon,
  "ai-usage": FlagIcon,
};

const ADMIN_ACTIONS: QuickAction[] = [
  { id: "qa-add-hotel", label: "Add Customer Hotel", href: "/admin/hotels", icon: HotelIcon, moduleKey: "platform_hotels" },
  { id: "qa-subscriptions", label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCardIcon, moduleKey: "platform_subscriptions" },
  { id: "qa-support", label: "Support Desk", href: "/admin/support", icon: LifeBuoyIcon, moduleKey: "platform_support" },
  { id: "qa-users", label: "Platform Admins", href: "/admin/users", icon: ShieldCheckIcon, moduleKey: "platform_users" },
  { id: "qa-entitlements", label: "Module Entitlements", href: "/admin/modules", icon: BlocksIcon, moduleKey: "platform_module_access" },
  { id: "qa-audit", label: "Audit Log", href: "/admin/audit", icon: ScrollTextIcon, moduleKey: "platform_audit" },
];

const PRIORITY_TONES: Record<SupportTicket["priority"], "danger" | "warning" | "neutral"> = {
  High: "danger",
  Medium: "warning",
  Low: "neutral",
};

const TICKET_COLUMNS: ResponsiveColumn<SupportTicket>[] = [
  {
    key: "hotel",
    header: "Hotel / Issue",
    render: (row) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{row.hotel}</span>
        <span className="truncate text-xs text-muted-foreground">
          {row.id} · {row.subject}
        </span>
      </span>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (row) => <StatusBadge tone={PRIORITY_TONES[row.priority]}>{row.priority}</StatusBadge>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge
        tone={
          row.status === "Resolved"
            ? "success"
            : row.status === "Waiting for Customer"
              ? "warning"
              : row.status === "In Progress"
                ? "info"
                : "primary"
        }
      >
        {row.status}
      </StatusBadge>
    ),
  },
  {
    key: "age",
    header: "Age",
    align: "right",
    render: (row) => <span className="text-xs text-muted-foreground">{row.age}</span>,
  },
];

export function AdminView() {
  return (
    <PageContainer width="wide">
      <PageHeader
        title="System Dashboard"
        description="Platform control plane · all customer hotels, subscriptions and support"
        actions={
          <Button
            type="button"
            size="sm"
            onClick={() => toast.info("Tenant onboarding arrives in the Platform Hotels module phase.")}
          >
            <PlusIcon aria-hidden="true" />
            Add customer hotel
          </Button>
        }
      />

      <div className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {MOCK_ADMIN_KPIS.map((metric) => {
            const Icon = KPI_ICONS[metric.id] ?? BuildingIcon;
            return <KpiCard key={metric.id} metric={metric} icon={Icon} />;
          })}
        </div>

        <QuickActionGrid title="Platform actions" actions={ADMIN_ACTIONS} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Support tickets</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResponsiveTable
                  columns={TICKET_COLUMNS}
                  rows={MOCK_SUPPORT_TICKETS}
                  getRowId={(row) => row.id}
                  caption="Open support tickets"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Platform audit log</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="flex flex-col gap-3">
                  {MOCK_PLATFORM_AUDIT.map((event: AuditEvent) => (
                    <li key={event.id} className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0">
                      <span className="flex items-center justify-between gap-2">
                        <span className="rounded-md border px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
                          {event.action}
                        </span>
                        <span className="text-[0.625rem] text-muted-foreground">{event.time}</span>
                      </span>
                      <span className="text-xs leading-relaxed">
                        <span className="font-medium">{event.actor}</span>
                        {" · "}
                        {event.target}
                      </span>
                      <span className="text-[0.625rem] text-muted-foreground">Scope: {event.scope}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
