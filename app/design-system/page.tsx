"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BedDouble,
  Bell,
  Blocks,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Crown,
  Eye,
  FileText,
  Filter,
  Layers,
  LayoutDashboard,
  MapPin,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useTheme } from "next-themes";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { SkeletonCards, SkeletonTable } from "@/components/states/skeletons";
import {
  ActivityTimeline,
  BookingStatusBadge,
  BookingSummary,
  BranchCard,
  DashboardMetricCard,
  GuestAvatar,
  GuestCard,
  HotelCard,
  HotelImageCard,
  ModuleCard,
  OccupancyCard,
  RevenueCard,
  RoomAvailability,
  RoomCard,
  RoomStatusBadge,
} from "@/components/hospitality";
import {
  ChartContainer,
  ContentAside,
  ContentGrid,
  ContentMain,
  MetricGrid,
  SidebarWidget,
  TableSection,
} from "@/components/dashboard/dashboard-primitives";
import { DESIGN_TOKENS } from "@/lib/design-system/tokens";

export default function DesignSystemShowcasePage() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [activeTab, setActiveTab] = React.useState("hospitality");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const sampleRooms = [
    { roomNumber: "101", floor: 1, category: "Deluxe Lake View", status: "available" as const },
    { roomNumber: "102", floor: 1, category: "Deluxe Lake View", status: "occupied" as const },
    { roomNumber: "103", floor: 1, category: "Standard Suite", status: "cleaning" as const },
    { roomNumber: "104", floor: 1, category: "Standard Suite", status: "reserved" as const },
    { roomNumber: "201", floor: 2, category: "Heritage Villa", status: "available" as const },
    { roomNumber: "202", floor: 2, category: "Heritage Villa", status: "occupied" as const },
    { roomNumber: "203", floor: 2, category: "Presidential Suite", status: "maintenance" as const },
    { roomNumber: "204", floor: 2, category: "Presidential Suite", status: "available" as const },
  ];

  const sampleActivities = [
    {
      id: "act-1",
      type: "checkin" as const,
      title: "Guest Checked In — Suite 201",
      description: "Mr. Vikramaditya Rathore verified identity & assigned keycard 201-A.",
      timestamp: "10 minutes ago",
      actor: "Pooja Sharma (Reception)",
    },
    {
      id: "act-2",
      type: "payment" as const,
      title: "Folio Settlement Received — ₹48,500",
      description: "Direct merchant UPI payment received for Folio #INV-8821.",
      timestamp: "35 minutes ago",
      actor: "Amit Patel (Cashier)",
    },
    {
      id: "act-3",
      type: "cleaning" as const,
      title: "Room 103 Cleared & Inspected",
      description: "Turnover inspection completed by Head Housekeeper.",
      timestamp: "1 hour ago",
      actor: "Sunita Rao",
    },
    {
      id: "act-4",
      type: "checkout" as const,
      title: "Guest Departed — Room 108",
      description: "Express check-out completed. Folio receipt dispatched via WhatsApp.",
      timestamp: "2 hours ago",
      actor: "Reception Console",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Building2 className="size-5" />
              </span>
              <div>
                <span className="text-sm font-bold tracking-tight">HotelHub</span>
                <span className="ml-2 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Phase 4 Design System
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </Button>
            )}
            <Button asChild size="sm" variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <PageContainer width="wide">
        <PageHeader
          hideBreadcrumbs
          title="Luxury Hospitality Design System"
          description="Centralized tokens, accessible core UI controls, hospitality domain components, and responsive layout primitives."
          actions={
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/onboarding">Onboarding Flow</Link>
              </Button>
            </div>
          }
        />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-muted/60">
            <TabsTrigger value="hospitality" className="py-2 text-xs font-medium">
              Hospitality Components
            </TabsTrigger>
            <TabsTrigger value="core" className="py-2 text-xs font-medium">
              Core UI Controls
            </TabsTrigger>
            <TabsTrigger value="tokens" className="py-2 text-xs font-medium">
              Design Tokens
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="py-2 text-xs font-medium">
              Dashboard Layouts
            </TabsTrigger>
            <TabsTrigger value="states" className="py-2 text-xs font-medium">
              States & Feedback
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: HOSPITALITY COMPONENTS */}
          <TabsContent value="hospitality" className="space-y-10">
            {/* Status Badges */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                1. Status Badges (Room & Booking)
              </h3>
              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Room Operating Statuses:</p>
                  <div className="flex flex-wrap gap-2">
                    <RoomStatusBadge status="available" />
                    <RoomStatusBadge status="occupied" />
                    <RoomStatusBadge status="reserved" />
                    <RoomStatusBadge status="cleaning" />
                    <RoomStatusBadge status="maintenance" />
                    <RoomStatusBadge status="outOfService" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Booking Lifecycles:</p>
                  <div className="flex flex-wrap gap-2">
                    <BookingStatusBadge status="confirmed" />
                    <BookingStatusBadge status="checkedIn" />
                    <BookingStatusBadge status="checkedOut" />
                    <BookingStatusBadge status="pending" />
                    <BookingStatusBadge status="cancelled" />
                    <BookingStatusBadge status="noShow" />
                  </div>
                </div>
              </div>
            </section>

            {/* Hotel Cards & Image Cards */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                2. Property Cards (HotelCard & HotelImageCard)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <HotelCard
                  name="The Royal Mirage Palace"
                  type="Heritage Boutique Hotel"
                  starRating="5 Star Luxury"
                  city="Udaipur"
                  country="India"
                  branchCount={2}
                  roomCount={68}
                  status="active"
                />
                <HotelImageCard
                  name="Bayview Coastal Luxury Suites"
                  location="Candolim Beach, Goa"
                  image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"
                  starRating="5 Star Luxury"
                  tag="Beachfront Resort"
                />
                <BranchCard
                  name="The Royal Mirage — Lake Pichola Wing"
                  code="UDR-MAIN"
                  city="Udaipur"
                  state="Rajasthan"
                  address="Palace Road, Near Lake Pichola"
                  phone="+91 98765 43210"
                  managerName="Vikramaditya Rathore"
                  isPrimary={true}
                  roomCount={42}
                />
              </div>
            </section>

            {/* Room Cards & Guest Cards */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                3. Room & Guest Profiles (RoomCard & GuestCard)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <RoomCard
                  roomNumber="201"
                  category="Deluxe Lake View"
                  floor={2}
                  status="available"
                  ratePerNight={14500}
                />
                <RoomCard
                  roomNumber="202"
                  category="Heritage Suite"
                  floor={2}
                  status="occupied"
                  currentGuest="Maharaja Y. Scindia"
                  ratePerNight={24000}
                />
                <GuestCard
                  name="Princess Gayatri Devi"
                  email="gayatri@heritagehospitality.com"
                  phone="+91 98290 11223"
                  city="Jaipur"
                  isVip={true}
                  totalStays={8}
                  currentRoom="202"
                />
                <GuestCard
                  name="Julian Sterling"
                  email="julian.sterling@londonventures.co.uk"
                  phone="+44 20 7946 0912"
                  city="London"
                  isVip={false}
                  totalStays={2}
                />
              </div>
            </section>

            {/* Operational Metrics: RevenueCard & OccupancyCard */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                4. Operational Analytics (RevenueCard, OccupancyCard, MetricCard)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RevenueCard
                  totalRevenue={1842500}
                  adr={16200}
                  revPar={13400}
                  changePercentage={14.8}
                />
                <OccupancyCard
                  occupiedRooms={54}
                  totalRooms={68}
                  cleaningCount={5}
                  arrivalsToday={14}
                  departuresToday={9}
                />
                <DashboardMetricCard
                  title="In-House Guests"
                  value={112}
                  icon={<Users className="size-4" />}
                  change={{ value: 8.5, label: "vs. yesterday", isPositiveGood: true }}
                />
              </div>
            </section>

            {/* Room Availability & Booking Summary */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                5. Room Availability Grid & Reservation Summary
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RoomAvailability rooms={sampleRooms} />
                </div>
                <div>
                  <BookingSummary
                    reservationId="RES-99420"
                    guestName="Lord Alistair Campbell"
                    roomNumber="204"
                    roomCategory="Presidential Royal Suite"
                    checkInDate="Oct 12, 2026"
                    checkOutDate="Oct 16, 2026"
                    nightsCount={4}
                    totalAmount={96000}
                    status="confirmed"
                  />
                </div>
              </div>
            </section>

            {/* Activity Timeline */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                6. Front Office Activity Timeline
              </h3>
              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <ActivityTimeline activities={sampleActivities} />
              </div>
            </section>
          </TabsContent>

          {/* TAB 2: CORE UI CONTROLS */}
          <TabsContent value="core" className="space-y-10">
            {/* Buttons & IconButtons */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                1. Button & Action Hierarchy
              </h3>
              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default">Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Action</Button>
                  <Button variant="default" disabled>Disabled State</Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t pt-4">
                  <IconButton icon={<Search className="size-4" />} label="Search bookings" tooltip="Search bookings" />
                  <IconButton icon={<Plus className="size-4" />} label="Add room" tooltip="Add room" variant="outline" />
                  <IconButton icon={<Trash2 className="size-4" />} label="Delete item" tooltip="Delete item" variant="destructive" />
                  <IconButton icon={<RefreshCw className="size-4" />} label="Loading" loading={true} />
                </div>
              </div>
            </section>

            {/* Form Fields & Inputs */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                2. Form Field System (Label, Input, Helper, Error)
              </h3>
              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    id="guest-name-demo"
                    label="Guest Full Name"
                    required
                    helperText="As printed on government photo ID."
                  >
                    <Input id="guest-name-demo" placeholder="e.g. Maharaja Vikramaditya" />
                  </FormField>

                  <FormField
                    id="email-error-demo"
                    label="Contact Email"
                    required
                    error="Please provide a valid corporate email address."
                  >
                    <Input
                      id="email-error-demo"
                      defaultValue="invalid-email-address"
                      className="border-destructive focus-visible:ring-destructive"
                    />
                  </FormField>

                  <FormField
                    id="notes-demo"
                    label="VIP Stay Requests & Amenities"
                    helperText="Specify dietary restrictions and airport transfer requests."
                    className="sm:col-span-2"
                  >
                    <Textarea id="notes-demo" rows={3} placeholder="e.g. Late check-out requested; complimentary champagne." />
                  </FormField>
                </div>
              </div>
            </section>

            {/* Alerts */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                3. Alert Messages & Feedback
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Alert variant="default">
                  <Bell className="size-4" />
                  <AlertTitle>Routine Audit Completed</AlertTitle>
                  <AlertDescription>
                    Night audit for Udaipur Lake Palace completed with 100% folio reconciliation.
                  </AlertDescription>
                </Alert>

                <Alert variant="success">
                  <CheckCircle2 className="size-4" />
                  <AlertTitle>Settlement Approved</AlertTitle>
                  <AlertDescription>
                    Direct merchant UPI payout of ₹1,42,000 has been verified.
                  </AlertDescription>
                </Alert>

                <Alert variant="warning">
                  <Sparkles className="size-4" />
                  <AlertTitle>Room Cleaning Overdue</AlertTitle>
                  <AlertDescription>
                    Room 104 has been in checkout turnover queue for over 45 minutes.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <Trash2 className="size-4" />
                  <AlertTitle>Payment Authorization Failed</AlertTitle>
                  <AlertDescription>
                    Card guarantee expired for Booking #RES-10492.
                  </AlertDescription>
                </Alert>
              </div>
            </section>

            {/* Glass Card */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                4. Luxury GlassCard (Frosted Depth)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard glow>
                  <GlassCardHeader>
                    <GlassCardTitle>Concierge Presidential Lounge</GlassCardTitle>
                    <GlassCardDescription>
                      Exclusive access to rooftop dining, private butler service, and lake transfers.
                    </GlassCardDescription>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="flex items-center justify-between text-xs py-2">
                      <span className="text-muted-foreground">Operating Window:</span>
                      <span className="font-semibold text-foreground">06:00 — 23:00</span>
                    </div>
                  </GlassCardContent>
                </GlassCard>

                <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">Confirmation Dialog Component</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Accessible modal with primary/destructive variants and async loading feedback.
                    </p>
                  </div>
                  <div className="pt-4">
                    <ConfirmationDialog
                      open={confirmOpen}
                      onOpenChange={setConfirmOpen}
                      title="Release Room Lockout?"
                      description="This will mark Room 203 as available for immediate guest booking."
                      confirmLabel="Release Room"
                      onConfirm={async () => {
                        await new Promise((r) => setTimeout(r, 600));
                      }}
                      trigger={<Button variant="outline">Test Confirmation Modal</Button>}
                    />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TAB 3: DESIGN TOKENS */}
          <TabsContent value="tokens" className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                Centralized Design Tokens Reference
              </h3>
              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Typography Scale
                  </h4>
                  <div className="space-y-3 border-b pb-6">
                    <div>
                      <span className="text-xs text-muted-foreground">Display (40px/48px):</span>
                      <p className="text-3xl font-bold tracking-tight text-foreground">
                        Royal Mirage Heritage & Luxury Resorts
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">H1 (32px):</span>
                      <p className="text-2xl font-semibold tracking-tight text-foreground">
                        Front Office & Reservations Management
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">H2 (24px):</span>
                      <p className="text-xl font-semibold text-foreground">
                        Room Inventory & Housekeeping Rosters
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Body Text (14px):</span>
                      <p className="text-sm text-foreground leading-relaxed">
                        Effortlessly synchronize arrivals, guest folios, and POS billing across properties with automated night audits.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Master Color System (Dark Luxury Hotel SaaS — Zero Gold)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 border-b pb-6">
                    <div className="rounded-xl border p-3 bg-[#070A16] text-white">
                      <div className="h-8 rounded-md bg-[#070A16] border border-white/20 mb-2" />
                      <p className="text-xs font-semibold">Canvas</p>
                      <span className="font-mono text-[10px] text-white/70">#070A16</span>
                    </div>
                    <div className="rounded-xl border p-3 bg-[#0C1022] text-white">
                      <div className="h-8 rounded-md bg-[#0C1022] border border-white/20 mb-2" />
                      <p className="text-xs font-semibold">Glass Surface</p>
                      <span className="font-mono text-[10px] text-white/70">#0C1022</span>
                    </div>
                    <div className="rounded-xl border p-3 bg-muted/40">
                      <div className="h-8 rounded-md bg-[#2563EB] mb-2" />
                      <p className="text-xs font-semibold">Electric Blue</p>
                      <span className="font-mono text-[10px] text-muted-foreground">#2563EB</span>
                    </div>
                    <div className="rounded-xl border p-3 bg-muted/40">
                      <div className="h-8 rounded-md bg-[#4F46E5] mb-2" />
                      <p className="text-xs font-semibold">Indigo</p>
                      <span className="font-mono text-[10px] text-muted-foreground">#4F46E5</span>
                    </div>
                    <div className="rounded-xl border p-3 bg-muted/40">
                      <div className="h-8 rounded-md bg-[#06B6D4] mb-2" />
                      <p className="text-xs font-semibold">Cyan / Teal</p>
                      <span className="font-mono text-[10px] text-muted-foreground">#06B6D4</span>
                    </div>
                    <div className="rounded-xl border p-3 bg-muted/40">
                      <div className="h-8 rounded-md bg-emerald-600 mb-2" />
                      <p className="text-xs font-semibold">Emerald Success</p>
                      <span className="font-mono text-[10px] text-muted-foreground">#10B981</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Border Radii & Depths
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="rounded-md border p-3 text-center bg-muted/30">
                      <p className="text-xs font-semibold">radius-sm (6px)</p>
                      <span className="text-[11px] text-muted-foreground">Badges, Pills</span>
                    </div>
                    <div className="rounded-lg border p-3 text-center bg-muted/30">
                      <p className="text-xs font-semibold">radius-md (8px)</p>
                      <span className="text-[11px] text-muted-foreground">Inputs, Buttons</span>
                    </div>
                    <div className="rounded-xl border p-3 text-center bg-muted/30">
                      <p className="text-xs font-semibold">radius-lg (10px)</p>
                      <span className="text-[11px] text-muted-foreground">Cards, Modals</span>
                    </div>
                    <div className="rounded-2xl border p-3 text-center bg-muted/30">
                      <p className="text-xs font-semibold">radius-2xl (18px)</p>
                      <span className="text-[11px] text-muted-foreground">Panels, Shelves</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TAB 4: DASHBOARD LAYOUTS */}
          <TabsContent value="dashboard" className="space-y-8">
            <MetricGrid columns={4}>
              <DashboardMetricCard
                title="Today Occupancy"
                value="79.4%"
                icon={<BedDouble className="size-4" />}
                change={{ value: 6.2, label: "vs. target" }}
              />
              <DashboardMetricCard
                title="RevPAR (INR)"
                value="₹13,400"
                icon={<CreditCard className="size-4" />}
                change={{ value: 12.1, label: "vs. avg" }}
              />
              <DashboardMetricCard
                title="Expected Arrivals"
                value="14"
                icon={<User className="size-4" />}
                subtitle="6 VIP arrivals registered"
              />
              <DashboardMetricCard
                title="Cleaning Queue"
                value="5"
                icon={<Sparkles className="size-4" />}
                change={{ value: -3.5, label: "turnover speed", isPositiveGood: true }}
              />
            </MetricGrid>

            <ContentGrid layout="split">
              <ContentMain>
                <ChartContainer
                  title="Revenue & ADR Trends"
                  subtitle="Past 7 operating days daily breakdown"
                >
                  <div className="h-48 flex items-center justify-center rounded-xl bg-muted/20 border border-dashed text-xs text-muted-foreground">
                    [Chart Container Canvas: Recharts / Live Area Projection]
                  </div>
                </ChartContainer>

                <TableSection
                  title="Today's Arrivals & Front Desk Queue"
                  subtitle="Showing guests scheduled for check-in today"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Nights</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Lord Alistair Campbell</TableCell>
                        <TableCell className="font-mono">Suite 204</TableCell>
                        <TableCell>4 Nights</TableCell>
                        <TableCell>
                          <BookingStatusBadge status="confirmed" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Princess Gayatri Devi</TableCell>
                        <TableCell className="font-mono">Villa 201</TableCell>
                        <TableCell>8 Nights</TableCell>
                        <TableCell>
                          <BookingStatusBadge status="checkedIn" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableSection>
              </ContentMain>

              <ContentAside>
                <SidebarWidget title="Duty Manager On Shift" icon={<User className="size-3.5" />}>
                  <p className="font-semibold text-foreground">Vikramaditya Rathore</p>
                  <p className="text-muted-foreground mt-0.5">Contact: Ext. 101 · +91 98765 43210</p>
                </SidebarWidget>

                <SidebarWidget title="Housekeeping Shift Handover" icon={<Sparkles className="size-3.5" />}>
                  <p className="text-muted-foreground">
                    Evening linen replenishment in progress across 2nd floor wings.
                  </p>
                </SidebarWidget>
              </ContentAside>
            </ContentGrid>
          </TabsContent>

          {/* TAB 5: STATES & FEEDBACK */}
          <TabsContent value="states" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <EmptyState
                  title="No Pending Work Orders"
                  description="All engineering and housekeeping work orders have been closed."
                />
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs">
                <ErrorState
                  title="Network Synchronization Error"
                  description="Could not reach the remote channel manager. Check your internet connection."
                  onRetry={() => {}}
                />
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs md:col-span-2">
                <LoadingState
                  compact
                  message="Synchronizing Room Matrix..."
                  description="Polling latest lock states and RFID keycard records."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}
