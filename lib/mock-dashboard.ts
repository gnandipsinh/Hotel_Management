import type { BookingRow, KpiMetric, OccupancyPoint, RoomTile, SupportTicket, AuditEvent } from "@/types/dashboard";

/**
 * Mock dashboard data — replaced by MongoDB/API responses in later phases.
 */

export const MOCK_KPI_METRICS: KpiMetric[] = [
  {
    id: "occupancy",
    label: "Occupancy today",
    value: "86.4%",
    sublabel: "72 of 84 rooms sold",
    trend: { direction: "up", value: "+4.2%", label: "vs last week" },
  },
  {
    id: "revenue",
    label: "Revenue today",
    value: "₹12,84,500",
    sublabel: "Rooms + F&B + Services",
    trend: { direction: "up", value: "+9.1%", label: "vs yesterday" },
  },
  {
    id: "arrivals",
    label: "Arrivals",
    value: "18",
    sublabel: "6 pre-registered · 2 VIP",
    trend: { direction: "neutral", value: "3 early", label: "before 12 PM" },
  },
  {
    id: "departures",
    label: "Departures",
    value: "12",
    sublabel: "4 pending settlement",
    trend: { direction: "neutral", value: "2 late", label: "after 12 PM" },
  },
  {
    id: "pending-payments",
    label: "Pending collection",
    value: "₹3,24,800",
    sublabel: "9 open folios",
    trend: { direction: "down", value: "-2.4%", label: "vs last week" },
    tone: "warning",
  },
  {
    id: "available-rooms",
    label: "Rooms available",
    value: "11",
    sublabel: "7 clean · 4 being prepared",
    trend: { direction: "neutral", value: "2 OOO", label: "out of order" },
    tone: "success",
  },
];

export const MOCK_BOOKING_ROWS: BookingRow[] = [
  {
    id: "GPHR-8492",
    guestName: "Mr. Rohan Singhania",
    guestSub: "+91 99876 45210 · 2 guests",
    room: "304 · Royal Lakefront Suite",
    checkIn: "26 Sep 2026",
    checkOut: "29 Sep 2026",
    nights: 3,
    source: "Website",
    status: "Confirmed",
    amount: "₹72,000",
    payment: "Advance ₹20,000 paid",
  },
  {
    id: "GPHR-8488",
    guestName: "Walk-in: Ms. Kavya Iyer",
    guestSub: "+91 91234 88921 · 1 guest",
    room: "112 · Heritage Deluxe",
    checkIn: "26 Sep 2026",
    checkOut: "27 Sep 2026",
    nights: 1,
    source: "Walk-in",
    status: "Checked-in",
    amount: "₹9,450",
    payment: "Paid in full (UPI)",
  },
  {
    id: "GPHR-8484",
    guestName: "Dr. Arvind Subramanian",
    guestSub: "Platinum VIP · 3 guests",
    room: "401 · Presidential Palace Suite",
    checkIn: "25 Sep 2026",
    checkOut: "28 Sep 2026",
    nights: 3,
    source: "Travel Agent",
    status: "Checked-in",
    amount: "₹2,85,000",
    payment: "Corporate billing",
  },
  {
    id: "GPHR-8496",
    guestName: "Pooja & Manish Khandelwal",
    guestSub: "Anniversary stay · 2 guests",
    room: "208 · Garden Villa",
    checkIn: "27 Sep 2026",
    checkOut: "30 Sep 2026",
    nights: 3,
    source: "OTA",
    status: "Pending",
    amount: "₹54,000",
    payment: "Card guarantee pending",
  },
  {
    id: "GPHR-8479",
    guestName: "TechCorp India (Ms. Neha Verma)",
    guestSub: "Corporate block · 1 guest",
    room: "214 · Heritage Deluxe",
    checkIn: "24 Sep 2026",
    checkOut: "26 Sep 2026",
    nights: 2,
    source: "Corporate",
    status: "Checked-out",
    amount: "₹21,600",
    payment: "Invoice INV-2026-0812 paid",
  },
  {
    id: "GPHR-8475",
    guestName: "Mr. Imran Qureshi",
    guestSub: "+91 90000 11122 · 2 guests",
    room: "305 · Royal Lakefront Suite",
    checkIn: "24 Sep 2026",
    checkOut: "25 Sep 2026",
    nights: 1,
    source: "Phone",
    status: "No-show",
    amount: "₹24,000",
    payment: "First night charged",
  },
];

export const MOCK_ROOM_TILES: RoomTile[] = [
  { number: "101", type: "Deluxe", status: "Available", detail: "Clean" },
  { number: "102", type: "Deluxe", status: "Occupied", detail: "Mr. Sharma · dep 27 Sep" },
  { number: "105", type: "Deluxe", status: "Cleaning", detail: "Assigned: Sunita" },
  { number: "112", type: "Heritage", status: "Occupied", detail: "Walk-in · checked in" },
  { number: "208", type: "Garden Villa", status: "Reserved", detail: "Arrival 27 Sep" },
  { number: "214", type: "Heritage", status: "Dirty", detail: "Departure cleaned?" },
  { number: "301", type: "Suite", status: "Available", detail: "Inspected" },
  { number: "304", type: "Royal Suite", status: "Reserved", detail: "VIP arrival 4 PM" },
  { number: "305", type: "Royal Suite", status: "Occupied", detail: "Departure today" },
  { number: "401", type: "Presidential", status: "Occupied", detail: "VIP · Dr. Subramanian" },
  { number: "402", type: "Presidential", status: "Maintenance", detail: "AC servicing" },
  { number: "210", type: "Heritage", status: "Out of Service", detail: "Renovation till Oct" },
];

export const MOCK_OCCUPANCY_WEEK: OccupancyPoint[] = [
  { label: "Mon", value: 71 },
  { label: "Tue", value: 74 },
  { label: "Wed", value: 78 },
  { label: "Thu", value: 82 },
  { label: "Fri", value: 91 },
  { label: "Sat", value: 96 },
  { label: "Sun", value: 86 },
];

export const MOCK_ADMIN_KPIS: KpiMetric[] = [
  { id: "hotels", label: "Customer hotels", value: "48", sublabel: "3 on trial", trend: { direction: "up", value: "+2", label: "this month" } },
  { id: "subscriptions", label: "Active subscriptions", value: "46", sublabel: "1 suspended · 1 expired", tone: "success" },
  { id: "tickets", label: "Open support tickets", value: "3", sublabel: "1 high priority", tone: "warning" },
  { id: "uptime", label: "Platform uptime", value: "99.98%", sublabel: "Last 30 days", trend: { direction: "up", value: "Healthy", label: "all services" }, tone: "success" },
  { id: "branches", label: "Managed branches", value: "112", sublabel: "Across 48 hotels" },
  { id: "ai-usage", label: "AI sessions today", value: "412", sublabel: "Staff 361 · Guest 51" },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: "SUP-2291", hotel: "Bayview Coastal Luxury Suites", subject: "UPI QR not showing at POS", priority: "High", status: "Open", age: "42 min" },
  { id: "SUP-2290", hotel: "The Meridian Metropolitan", subject: "Need GST invoice format with HSN summary", priority: "Medium", status: "In Progress", age: "3 hours" },
  { id: "SUP-2288", hotel: "Grand Palace Heritage Resort", subject: "Add 4th branch (Aravalli Wing) to plan", priority: "Low", status: "Waiting for Customer", age: "1 day" },
];

export const MOCK_PLATFORM_AUDIT: AuditEvent[] = [
  { id: "AUD-9910", actor: "Ananya Deshmukh", action: "MODULE_ENABLED", target: "POS module enabled for Bayview Coastal", scope: "hotel-03", time: "09:42 AM" },
  { id: "AUD-9909", actor: "System", action: "SUBSCRIPTION_RENEWED", target: "Grand Palace Heritage Resort — Enterprise annual", scope: "hotel-01", time: "08:15 AM" },
  { id: "AUD-9908", actor: "Rahul Mehta", action: "SUPPORT_ACCESS_STARTED", target: "Impersonation session · Meridian Finance (15 min)", scope: "hotel-02", time: "Yesterday" },
];
