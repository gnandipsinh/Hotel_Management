"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  BedDoubleIcon,
  CalendarPlusIcon,
  ClockIcon,
  IndianRupeeIcon,
  KeyRoundIcon,
  LogInIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PackageIcon,
  ReceiptTextIcon,
  SparklesIcon,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useShell } from "@/components/layout/shell-context";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { QuickActionGrid, type QuickAction } from "@/components/dashboard/quick-action-grid";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import { RoomStatusTiles } from "@/components/dashboard/room-status-tiles";
import { ResponsiveTable, type ResponsiveColumn } from "@/components/data/responsive-table";
import { StatusBadge, BOOKING_STATUS_TONES } from "@/components/data/status-badge";
import { DataState, type DataStateKind } from "@/components/states/data-state";
import { DEMO_PRESETS } from "@/config/navigation";
import { useDemoSession } from "@/lib/demo/demo-session";
import {
  MOCK_BOOKING_ROWS,
  MOCK_KPI_METRICS,
} from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";
import type { BookingRow } from "@/types/dashboard";
import type { CustomerModuleKey } from "@/types/navigation";

const KPI_ICONS: Record<string, LucideIcon> = {
  occupancy: BedDoubleIcon,
  revenue: IndianRupeeIcon,
  arrivals: LogInIcon,
  departures: LogOutIcon,
  "pending-payments": ClockIcon,
  "available-rooms": KeyRoundIcon,
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: "qa-booking", label: "New Booking", href: "/bookings/new", icon: CalendarPlusIcon, moduleKey: "bookings" },
  { id: "qa-guest", label: "Add Guest", href: "/guests", icon: UserPlusIcon, moduleKey: "guests" },
  { id: "qa-checkin", label: "Check-in Guest", href: "/reception", icon: LogInIcon, moduleKey: "reception" },
  { id: "qa-invoice", label: "New Invoice", href: "/finance/invoices", icon: ReceiptTextIcon, moduleKey: "finance" },
  { id: "qa-hk", label: "Housekeeping Task", href: "/housekeeping/tasks", icon: SparklesIcon, moduleKey: "housekeeping" },
  { id: "qa-po", label: "Purchase Order", href: "/inventory", icon: PackageIcon, moduleKey: "inventory" },
];

const BOOKING_COLUMNS: ResponsiveColumn<BookingRow>[] = [
  {
    key: "guest",
    header: "Guest",
    render: (row) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{row.guestName}</span>
        <span className="truncate text-xs text-muted-foreground">{row.guestSub}</span>
      </span>
    ),
  },
  {
    key: "room",
    header: "Room",
    render: (row) => <span className="text-xs">{row.room}</span>,
  },
  {
    key: "dates",
    header: "Stay",
    render: (row) => (
      <span className="flex flex-col text-xs">
        <span>
          {row.checkIn} → {row.checkOut}
        </span>
        <span className="text-muted-foreground">{row.nights} nights</span>
      </span>
    ),
  },
  {
    key: "source",
    header: "Source",
    hideOnMobile: true,
    render: (row) => (
      <span className="inline-flex rounded-md border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground">
        {row.source}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge tone={BOOKING_STATUS_TONES[row.status] ?? "neutral"}>
        {row.status}
      </StatusBadge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (row) => (
      <span className="flex flex-col items-end text-xs">
        <span className="font-semibold tabular-nums">{row.amount}</span>
        <span className="text-muted-foreground">{row.payment}</span>
      </span>
    ),
  },
];

function ModulePresetCard() {
  const { enabledModules, setEnabledModules, user } = useShell();
  const demoSession = useDemoSession();

  // Phase 8: with a demo session, module access is fixed by the demo role's
  // grants intersected with the hotel plan — the card becomes a read-only
  // summary instead of a preset switcher.
  if (demoSession) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Your module access</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {enabledModules.map((moduleKey) => (
              <span
                key={moduleKey}
                className="rounded-md border bg-muted/60 px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground"
              >
                {moduleKey}
              </span>
            ))}
            {enabledModules.length === 0 && (
              <span className="text-xs text-muted-foreground">No modules are enabled yet.</span>
            )}
          </div>
          <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
            Fixed by <span className="font-medium text-foreground">{user.roleName}</span> role
            grants and this hotel&apos;s plan — configuration-driven, not hard-coded per hotel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Module access preview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 px-4 pb-4">
        <div className="flex flex-col gap-1.5">
          {Object.entries(DEMO_PRESETS).map(([key, preset]) => {
            const active =
              JSON.stringify([...enabledModules].sort()) ===
              JSON.stringify([...preset.modules].sort());
            return (
              <button
                key={key}
                type="button"
                onClick={() => setEnabledModules(preset.modules as CustomerModuleKey[])}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-medium outline-none transition-colors",
                  "focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "hover:bg-muted",
                )}
              >
                <span className="truncate">{preset.label}</span>
                <span className="ml-2 shrink-0 text-muted-foreground">
                  {preset.modules.length} modules
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
          Switching a preset updates the sidebar instantly. Frontend preview only —
          backend enforcement arrives with entitlements.
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const { hotel, branch } = useShell();
  const [demoState, setDemoState] = React.useState<DataStateKind>("success");

  const rowActions = (row: BookingRow) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for booking ${row.id}`}
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => toast.info(`Booking details for ${row.id} arrive in the Bookings module phase.`)}>
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast.info("Date changes require the reservation engine phase.")}>
          Change dates
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast.info("Invoicing arrives in the Finance module phase.")}>
          Print invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Dashboard"
        description={`Today · ${hotel.name} · ${branch?.name} · Friday, 26 September 2026`}
        actions={
          <>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href="/reports">View reports</Link>
            </Button>
            <Button type="button" size="sm" asChild>
              <Link href="/bookings/new">
                <CalendarPlusIcon aria-hidden="true" />
                New booking
              </Link>
            </Button>
          </>
        }
      />

      <div className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {MOCK_KPI_METRICS.map((metric) => {
            const Icon = KPI_ICONS[metric.id] ?? BedDoubleIcon;
            return <KpiCard key={metric.id} metric={metric} icon={Icon} />;
          })}
        </div>

        <QuickActionGrid actions={QUICK_ACTIONS} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            <Card>
              <CardHeader className="flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-semibold">Today&rsquo;s bookings</CardTitle>
                <Tabs
                  value={demoState}
                  onValueChange={(value) => setDemoState(value as DataStateKind)}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="success" className="text-xs">
                      Live
                    </TabsTrigger>
                    <TabsTrigger value="loading" className="text-xs">
                      Loading
                    </TabsTrigger>
                    <TabsTrigger value="empty" className="text-xs">
                      Empty
                    </TabsTrigger>
                    <TabsTrigger value="error" className="text-xs">
                      Error
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <DataState
                  state={demoState}
                  skeleton="table"
                  skeletonRows={5}
                  empty={{
                    icon: CalendarPlusIcon,
                    title: "No bookings yet",
                    description:
                      "When your first reservation is created it will appear here with live status and payment summary.",
                    action: { label: "Create your first booking", href: "/bookings/new" },
                  }}
                  error={{
                    title: "Unable to load bookings",
                    description:
                      "The bookings service did not respond. Check your connection and try again.",
                    onRetry: () => setDemoState("success"),
                  }}
                >
                  <ResponsiveTable
                    columns={BOOKING_COLUMNS}
                    rows={MOCK_BOOKING_ROWS}
                    getRowId={(row) => row.id}
                    caption="Today's bookings"
                    rowActions={rowActions}
                  />
                </DataState>
              </CardContent>
            </Card>

            <RoomStatusTiles />
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <OccupancyChart />
            <ActivityFeed />
            <ModulePresetCard />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
