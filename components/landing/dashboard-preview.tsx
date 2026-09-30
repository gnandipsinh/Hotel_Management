"use client";

import * as React from "react";
import {
  BellIcon,
  CalendarCheckIcon,
  ChevronDownIcon,
  QrCodeIcon,
  SearchIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

interface RoomData {
  number: string;
  type: string;
  status: "occupied" | "reserved" | "available" | "cleaning";
  guest: string;
  nights: string;
  price: string;
}

interface BranchData {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  occupiedRooms: number;
  revenue: number;
  upiRevenue: number;
  gstRevenue: number;
  arrivals: number;
  departures: number;
  rooms: RoomData[];
}

const BRANCHES: BranchData[] = [
  {
    id: "goa",
    name: "Goa Beachfront Resort",
    location: "Candolim, Goa",
    totalRooms: 52,
    occupiedRooms: 45,
    revenue: 168450,
    upiRevenue: 112000,
    gstRevenue: 20214,
    arrivals: 14,
    departures: 9,
    rooms: [
      { number: "101", type: "Deluxe King", status: "occupied", guest: "Dr. S. Verma", nights: "3N", price: "₹4,800/n" },
      { number: "102", type: "Deluxe Twin", status: "reserved", guest: "K. Malhotra", nights: "2N", price: "₹4,800/n" },
      { number: "103", type: "Executive Suite", status: "available", guest: "Ready for Guest", nights: "-", price: "₹7,500/n" },
      { number: "104", type: "Ocean Villa", status: "cleaning", guest: "Housekeeper: Anita", nights: "-", price: "₹12,000/n" },
      { number: "105", type: "Royal Penthouse", status: "occupied", guest: "VIP: Aisha Khan", nights: "5N", price: "₹18,500/n" },
      { number: "106", type: "Garden Cottage", status: "available", guest: "Ready for Guest", nights: "-", price: "₹5,200/n" },
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai Business Tower",
    location: "BKC, Mumbai",
    totalRooms: 85,
    occupiedRooms: 76,
    revenue: 294200,
    upiRevenue: 185000,
    gstRevenue: 35300,
    arrivals: 22,
    departures: 18,
    rooms: [
      { number: "201", type: "Business Club", status: "occupied", guest: "Aditya Roy (TCS)", nights: "4N", price: "₹6,500/n" },
      { number: "202", type: "Business Club", status: "available", guest: "Ready for Guest", nights: "-", price: "₹6,500/n" },
      { number: "305", type: "Corporate Suite", status: "occupied", guest: "Neha Singhal", nights: "2N", price: "₹9,200/n" },
      { number: "401", type: "Executive King", status: "cleaning", guest: "Housekeeper: Raju", nights: "-", price: "₹7,800/n" },
      { number: "402", type: "Executive King", status: "reserved", guest: "Sanjay Kapoor", nights: "1N", price: "₹7,800/n" },
      { number: "501", type: "Presidential Sky", status: "occupied", guest: "MD: Cyrus Mistry", nights: "3N", price: "₹22,000/n" },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur Heritage Palace",
    location: "Civil Lines, Jaipur",
    totalRooms: 40,
    occupiedRooms: 36,
    revenue: 142800,
    upiRevenue: 98000,
    gstRevenue: 17136,
    arrivals: 10,
    departures: 6,
    rooms: [
      { number: "01", type: "Maharaja Suite", status: "occupied", guest: "Lord Harrington", nights: "6N", price: "₹25,000/n" },
      { number: "02", type: "Heritage Deluxe", status: "available", guest: "Ready for Guest", nights: "-", price: "₹6,200/n" },
      { number: "03", type: "Courtyard Room", status: "occupied", guest: "P. R. Rathore", nights: "2N", price: "₹5,500/n" },
      { number: "04", type: "Havelis Royal", status: "reserved", guest: "Anjali Gupta", nights: "3N", price: "₹8,000/n" },
      { number: "05", type: "Peacock Suite", status: "cleaning", guest: "Housekeeper: Meena", nights: "-", price: "₹14,000/n" },
      { number: "06", type: "Courtyard Room", status: "available", guest: "Ready for Guest", nights: "-", price: "₹5,500/n" },
    ],
  },
];

export function DashboardPreview() {
  const [selectedBranchId, setSelectedBranchId] = React.useState("goa");
  const [branchDropdownOpen, setBranchDropdownOpen] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(3);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"all" | "occupied" | "available" | "cleaning">("all");

  // Dynamic branch state
  const [branchesData, setBranchesData] = React.useState<BranchData[]>(BRANCHES);
  const currentBranch = branchesData.find((b) => b.id === selectedBranchId) || branchesData[0];

  // Quick check-in modal state
  const [checkInModalOpen, setCheckInModalOpen] = React.useState(false);
  const [newGuestName, setNewGuestName] = React.useState("");
  const [newGuestRoom, setNewGuestRoom] = React.useState("");

  // Selected room details modal
  const [selectedRoom, setSelectedRoom] = React.useState<RoomData | null>(null);

  // Filtered rooms
  const filteredRooms = currentBranch.rooms.filter((room) => {
    const matchesTab = activeTab === "all" ? true : room.status === activeTab;
    const matchesSearch =
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.guest.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    setBranchDropdownOpen(false);
    const branch = branchesData.find((b) => b.id === branchId);
    if (branch) {
      toast.success(`Switched branch to ${branch.name}`, {
        description: `${branch.totalRooms} rooms total · ${branch.location}`,
      });
    }
  };

  const handleQuickCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) {
      toast.error("Please enter a guest name.");
      return;
    }

    const targetRoomNumber = newGuestRoom || currentBranch.rooms.find((r) => r.status === "available")?.number || "103";

    setBranchesData((prev) =>
      prev.map((b) => {
        if (b.id !== currentBranch.id) return b;
        return {
          ...b,
          occupiedRooms: Math.min(b.totalRooms, b.occupiedRooms + 1),
          revenue: b.revenue + 5000,
          arrivals: b.arrivals + 1,
          rooms: b.rooms.map((r) =>
            r.number === targetRoomNumber
              ? { ...r, status: "occupied", guest: newGuestName.trim(), nights: "2N" }
              : r
          ),
        };
      })
    );

    toast.success(`Check-in complete for ${newGuestName}!`, {
      description: `Room #${targetRoomNumber} issued. Dynamic UPI invoice generated.`,
    });

    setCheckInModalOpen(false);
    setNewGuestName("");
  };

  const handleUpdateRoomStatus = (roomNumber: string, newStatus: RoomData["status"]) => {
    setBranchesData((prev) =>
      prev.map((b) => {
        if (b.id !== currentBranch.id) return b;
        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.number !== roomNumber) return r;
            const newGuest =
              newStatus === "available"
                ? "Ready for Guest"
                : newStatus === "cleaning"
                ? "Housekeeping Assigned"
                : r.guest;
            return { ...r, status: newStatus, guest: newGuest };
          }),
        };
      })
    );

    toast.success(`Room #${roomNumber} updated to ${newStatus.toUpperCase()}`);
    setSelectedRoom(null);
  };

  const occupancyPercent = Math.round(
    (currentBranch.occupiedRooms / currentBranch.totalRooms) * 100
  );

  return (
    <div className="relative mx-auto w-full max-w-4xl select-none">
      {/* Ambient background glow accents */}
      <div className="absolute -top-10 -right-10 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 -z-10 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Main Glass Dashboard Shell */}
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0C1022]/95 shadow-2xl shadow-blue-950/70 backdrop-blur-xl">
        {/* Window Chrome / Titlebar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#090D1C] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-[#FF5F56]/80 inline-block" />
              <span className="size-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
              <span className="size-3 rounded-full bg-[#27C93F]/80 inline-block" />
            </div>
            <span className="ml-3 text-xs font-medium text-slate-400">
              HotelHub Cloud PMS · <span className="text-slate-200 font-semibold">{currentBranch.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-medium text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Server Sync
            </span>
            <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-slate-300">
              v4.2.0
            </span>
          </div>
        </div>

        {/* Mockup Internal Header */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0E1428] px-4 py-3">
          {/* Interactive Branch Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#141C38] px-3 py-1.5 text-xs text-white hover:border-blue-400/50 transition-colors"
            >
              <div className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold">{currentBranch.name}</span>
              <ChevronDownIcon className="size-3 text-slate-400" />
            </button>

            {/* Branch Selector Dropdown */}
            {branchDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl border border-white/15 bg-[#0C1226] p-2 shadow-2xl backdrop-blur-xl z-30">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Hotel Property
                </div>
                {branchesData.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => handleBranchSelect(branch.id)}
                    className={`flex w-full flex-col items-start rounded-lg px-2.5 py-2 text-left transition-colors ${
                      branch.id === currentBranch.id
                        ? "bg-blue-600/20 text-cyan-300 font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-xs">{branch.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {branch.totalRooms} Rooms · {branch.location}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Mock Actions & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search room, guest..."
                className="h-8 w-36 sm:w-44 rounded-lg border border-white/10 bg-[#090D1C] pl-8 pr-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setCheckInModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/30 hover:scale-[1.02] transition-transform"
            >
              <CalendarCheckIcon className="size-3.5" />
              <span className="hidden sm:inline">+ Quick Check-in</span>
              <span className="sm:hidden">+ Check-in</span>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  if (!notificationOpen) setUnreadNotifications(0);
                }}
                className="relative flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#141C38] text-slate-300 hover:text-white transition-colors"
                aria-label="View hotel notifications"
              >
                <BellIcon className="size-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/15 bg-[#0C1226] p-2.5 shadow-2xl backdrop-blur-xl z-30">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 px-1 text-xs">
                    <span className="font-semibold text-white">Live Front Desk Feed</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Real-time</span>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-lg bg-blue-950/30 border border-blue-500/20 p-2">
                      <div className="text-[11px] font-semibold text-white">UPI Payment Received</div>
                      <div className="text-[10px] text-slate-400">₹14,500 via PhonePe QR · Folio #9204</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/5 p-2">
                      <div className="text-[11px] font-semibold text-white">Housekeeping Alert</div>
                      <div className="text-[10px] text-slate-400">Room 104 requested turnaround</div>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/5 p-2">
                      <div className="text-[11px] font-semibold text-white">OTA Channel Sync</div>
                      <div className="text-[10px] text-slate-400">Direct booking via HotelHub Web</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Body Metrics Grid */}
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {/* Metric 1: Today's Revenue */}
            <div className="rounded-xl border border-white/10 bg-[#111730]/90 p-3.5 transition-all hover:border-blue-500/40">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Today&apos;s Revenue</span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold text-[11px]">
                  <TrendingUpIcon className="size-3" /> +18.4%
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-white">
                  ₹{currentBranch.revenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-1.5">
                <span className="flex items-center gap-1 text-cyan-300">
                  <QrCodeIcon className="size-3" /> UPI: ₹{(currentBranch.upiRevenue / 1000).toFixed(0)}k
                </span>
                <span>GST: ₹{(currentBranch.gstRevenue / 1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* Metric 2: Occupancy Rate */}
            <div className="rounded-xl border border-white/10 bg-[#111730]/90 p-3.5 transition-all hover:border-purple-500/40">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Occupancy Rate</span>
                <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300">
                  Peak Day
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-white">{occupancyPercent}%</span>
                <span className="text-xs text-slate-400 font-normal">
                  {currentBranch.occupiedRooms} / {currentBranch.totalRooms} Rooms
                </span>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Arrivals & Departures */}
            <div className="rounded-xl border border-white/10 bg-[#111730]/90 p-3.5 transition-all hover:border-cyan-500/40">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Arrivals & Departures</span>
                <UsersIcon className="size-3.5 text-blue-400" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-white">{currentBranch.arrivals}</span>
                <span className="text-xs text-emerald-400 font-medium">Checked-in</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-1.5">
                <span>{currentBranch.departures} Departures</span>
                <span className="text-cyan-400">Front Desk Active</span>
              </div>
            </div>

            {/* Metric 4: RevPAR / ADR */}
            <div className="rounded-xl border border-white/10 bg-[#111730]/90 p-3.5 transition-all hover:border-emerald-500/40">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>RevPAR / ADR</span>
                <span className="text-[10px] text-cyan-400 font-mono">INR</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-white">
                  ₹{Math.round(currentBranch.revenue / currentBranch.totalRooms).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400">
                  / ₹{Math.round(currentBranch.revenue / currentBranch.occupiedRooms).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-1.5">
                <span className="text-emerald-400 font-medium">+14.6% MoM</span>
                <span className="text-slate-400">{currentBranch.occupiedRooms} sold</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Room Rack / Matrix */}
          <div className="mt-4 rounded-xl border border-white/10 bg-[#0A0F22]/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Interactive Room Matrix
                </span>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                  Click room to inspect
                </span>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#11172E] p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    activeTab === "all" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({currentBranch.rooms.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("occupied")}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    activeTab === "occupied" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Occupied
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("available")}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    activeTab === "available" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("cleaning")}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    activeTab === "cleaning" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Cleaning
                </button>
              </div>
            </div>

            {/* Room cards grid */}
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {filteredRooms.map((room) => {
                const isOccupied = room.status === "occupied";
                const isReserved = room.status === "reserved";
                const isAvailable = room.status === "available";

                return (
                  <button
                    key={room.number}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className={`group relative flex flex-col justify-between text-left rounded-xl border p-2.5 transition-all cursor-pointer ${
                      isOccupied
                        ? "border-blue-500/30 bg-blue-950/25 hover:border-blue-400 hover:scale-[1.02]"
                        : isReserved
                        ? "border-purple-500/30 bg-purple-950/25 hover:border-purple-400 hover:scale-[1.02]"
                        : isAvailable
                        ? "border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400 hover:scale-[1.02]"
                        : "border-amber-500/30 bg-amber-950/25 hover:border-amber-400 hover:scale-[1.02]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-white">#{room.number}</span>
                        <span
                          className={`size-2 rounded-full ${
                            isOccupied
                              ? "bg-blue-400 shadow-sm shadow-blue-400"
                              : isReserved
                              ? "bg-purple-400 shadow-sm shadow-purple-400"
                              : isAvailable
                              ? "bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse"
                              : "bg-amber-400 shadow-sm shadow-amber-400"
                          }`}
                        />
                      </div>
                      <div className="mt-1 text-[11px] font-medium text-slate-300 truncate">
                        {room.type}
                      </div>
                    </div>

                    <div className="mt-3 border-t border-white/5 pt-2">
                      <div className="truncate text-[10px] text-slate-400">
                        {room.guest}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span
                          className={`rounded px-1.5 py-0.5 font-medium capitalize ${
                            isOccupied
                              ? "bg-blue-500/20 text-blue-300"
                              : isReserved
                              ? "bg-purple-500/20 text-purple-300"
                              : isAvailable
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {room.status}
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">{room.price.split("/")[0]}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Live Operations Ticker */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-[#0C1224] px-3 py-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px]">
                  <strong className="text-white font-semibold">UPI Payment Received:</strong> ₹14,500 via PhonePe QR for Suite #{currentBranch.rooms[0]?.number} (GST Folio #INV-9204)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">12s ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="absolute -top-4 -right-4 hidden lg:flex items-center gap-2.5 rounded-xl border border-blue-400/30 bg-[#0E1530]/95 p-3 shadow-xl shadow-black/60 backdrop-blur-md">
        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400">
          <QrCodeIcon className="size-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Dynamic UPI & GST Invoicing</div>
          <div className="text-[10px] text-slate-400">0% Commission · Instant Settlement</div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-4 hidden lg:flex items-center gap-2.5 rounded-xl border border-purple-400/30 bg-[#0E1530]/95 p-3 shadow-xl shadow-black/60 backdrop-blur-md">
        <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
          <ShieldCheckIcon className="size-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Multi-Branch Single Console</div>
          <div className="text-[10px] text-slate-400">Manage 1 to 50+ Hotel Branches</div>
        </div>
      </div>

      {/* Quick Check-in Modal */}
      {checkInModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-blue-500/40 bg-[#0D1326] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setCheckInModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XIcon className="size-4" />
            </button>

            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarCheckIcon className="size-5 text-cyan-400" />
              Quick Front Desk Check-in
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Issue room keys and generate GST invoice instantly for {currentBranch.name}.
            </p>

            <form onSubmit={handleQuickCheckInSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300">Guest Full Name</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#080C1B] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Assign Available Room</label>
                <select
                  value={newGuestRoom}
                  onChange={(e) => setNewGuestRoom(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#080C1B] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {currentBranch.rooms.map((r) => (
                    <option key={r.number} value={r.number}>
                      Room #{r.number} — {r.type} ({r.price}) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCheckInModalOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/40"
                >
                  Confirm Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Room Detail Drawer / Dialog */}
      {selectedRoom && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-[#0D1326] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XIcon className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-white">#{selectedRoom.number}</span>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300 capitalize">
                {selectedRoom.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 mt-1">{selectedRoom.type}</p>
            <p className="text-xs text-slate-400">Current Occupant: {selectedRoom.guest}</p>
            <p className="text-xs font-mono text-cyan-300 mt-1">{selectedRoom.price}</p>

            <div className="mt-5 border-t border-white/10 pt-4 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Actions:
              </div>
              <button
                type="button"
                onClick={() => handleUpdateRoomStatus(selectedRoom.number, "available")}
                className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/40 transition-colors"
              >
                ✓ Mark as Clean & Available
              </button>
              <button
                type="button"
                onClick={() => handleUpdateRoomStatus(selectedRoom.number, "cleaning")}
                className="w-full rounded-lg border border-amber-500/30 bg-amber-950/20 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-950/40 transition-colors"
              >
                🧹 Dispatch Housekeeping
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(`Dynamic UPI QR sent to ${selectedRoom.guest}`, {
                    description: `Amount: ${selectedRoom.price.split("/")[0]} · WhatsApp notification delivered.`,
                  });
                  setSelectedRoom(null);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-950/30 py-2 text-xs font-semibold text-cyan-300 hover:bg-blue-950/50 transition-colors"
              >
                <QrCodeIcon className="size-3.5" />
                Send Dynamic UPI QR Folio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
