"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BedDoubleIcon,
  Building2Icon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  CircleDollarSignIcon,
  FileSpreadsheetIcon,
  GlobeIcon,
  LineChartIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface StripFeature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
  details: string;
  capabilities: string[];
  roleUsedBy: string;
}

const STRIP_FEATURES: StripFeature[] = [
  {
    id: "booking",
    icon: CalendarCheckIcon,
    title: "Booking Management",
    desc: "Real-time calendar & OTA sync",
    color: "from-blue-500 to-cyan-400",
    details: "Unifies direct bookings, walk-ins, phone reservations, and 50+ OTAs (MakeMyTrip, Booking.com, Agoda) into one live reservation matrix with zero double bookings.",
    capabilities: ["Instant OTA 2-way rate & inventory sync", "Interactive drag-and-drop booking grid", "Automated booking confirmation SMS & WhatsApp"],
    roleUsedBy: "Front Desk & Reservations Manager",
  },
  {
    id: "room",
    icon: BedDoubleIcon,
    title: "Room Management",
    desc: "Live matrix & turnover state",
    color: "from-indigo-500 to-blue-400",
    details: "Manage inventory, categories, floor maps, and maintenance states with color-coded live indicators for occupied, reserved, available, and cleaning.",
    capabilities: ["Visual floor plan rack & room grid", "Dynamic room pricing & extra bed charges", "Out-of-order and maintenance blocking"],
    roleUsedBy: "Front Desk & Duty Manager",
  },
  {
    id: "guest",
    icon: UsersIcon,
    title: "Guest Management",
    desc: "Profiles, history & preferences",
    color: "from-purple-500 to-indigo-400",
    details: "Store comprehensive guest profiles, stay records, preferences, corporate billing accounts, and Aadhaar/passport digital ID records.",
    capabilities: ["Digital registration card (Aadhaar & Passport)", "VIP guest tags & preferences history", "Corporate billing ledger with GSTIN"],
    roleUsedBy: "Guest Relations & Concierge",
  },
  {
    id: "staff",
    icon: ShieldCheckIcon,
    title: "Staff Management",
    desc: "Shifts, roles & biometric logs",
    color: "from-blue-600 to-purple-500",
    details: "14 specialized staff panels ensuring strict operational separation. Roster shifts, track department tasks, and audit every user action.",
    capabilities: ["14 distinct RBAC panels", "Shift handovers & cash drawer sign-offs", "Complete tamper-proof audit trails"],
    roleUsedBy: "HR & General Manager",
  },
  {
    id: "payments",
    icon: CircleDollarSignIcon,
    title: "Payments & UPI",
    desc: "Dynamic QR & instant settlement",
    color: "from-cyan-500 to-blue-500",
    details: "Generate dynamic UPI QR codes instantly on desk monitors. Zero manual entry, zero reconciliation errors, and immediate automated folio closing.",
    capabilities: ["Dynamic counter QR with auto-filled amount", "Direct bank settlement with zero MDR", "Multi-split payments (UPI, Card, Cash, OTA)"],
    roleUsedBy: "Cashier, Reception & Night Auditor",
  },
  {
    id: "analytics",
    icon: LineChartIcon,
    title: "Reports & Analytics",
    desc: "ADR, RevPAR & daily cashbook",
    color: "from-indigo-500 to-cyan-400",
    details: "Comprehensive business intelligence for hoteliers. Monitor real-time ADR, RevPAR, channel yield, daily manager cashbooks, and revenue forecasts.",
    capabilities: ["Automated Night Audit & Manager Report", "ADR & RevPAR visualizers", "Channel yield and OTA commission analysis"],
    roleUsedBy: "Hotel Owner & General Manager",
  },
  {
    id: "multibranch",
    icon: Building2Icon,
    title: "Multi-Branch Support",
    desc: "Centralized chain governance",
    color: "from-blue-500 to-purple-500",
    details: "Run 2 to 50+ hotel branches from one single master dashboard. Cross-property room availability checks and unified consolidated balance sheets.",
    capabilities: ["Instant multi-property switcher", "Centralized corporate accounts", "Consolidated chain P&L reports"],
    roleUsedBy: "Group Managing Director & Chain GM",
  },
  {
    id: "gst",
    icon: ReceiptTextIcon,
    title: "GST Ready Invoicing",
    desc: "Automated SAC codes & e-Way",
    color: "from-cyan-400 to-indigo-500",
    details: "Strict compliance with Indian GST regulations. Automatic SAC 9963 tax classification (12% vs 18%), B2B reverse charge, and GSTR export.",
    capabilities: ["SAC code auto-lookup based on room tariff", "State & Central GST split (CGST + SGST)", "One-click GSTR-1 Excel export"],
    roleUsedBy: "Accounts Team & Front Desk",
  },
  {
    id: "website",
    icon: GlobeIcon,
    title: "Hotel Website Builder",
    desc: "Zero-commission direct bookings",
    color: "from-purple-500 to-blue-400",
    details: "Build a blazing fast, SEO-optimized direct booking engine for your hotel with built-in payment gateway and zero commission per booking.",
    capabilities: ["Mobile-first direct booking engine", "Integrated UPI & NetBanking payment gateway", "Custom domain & room package showcase"],
    roleUsedBy: "Sales & Marketing",
  },
  {
    id: "rbac",
    icon: FileSpreadsheetIcon,
    title: "Role-Based Access",
    desc: "14 dedicated staff panels",
    color: "from-blue-400 to-cyan-300",
    details: "Dedicated panels tailored specifically for Super Admin, Owner, Manager, Receptionist, Housekeeping, Chef, POS Cashier, and Maintenance.",
    capabilities: ["Strict tenant isolation", "Configurable permission matrices", "Role-based route guarding"],
    roleUsedBy: "System Administrator",
  },
];

export function FeatureStrip() {
  const [selectedFeature, setSelectedFeature] = React.useState<StripFeature | null>(null);

  const handleCardClick = (feat: StripFeature) => {
    setSelectedFeature(feat);
    toast.info(`Inspecting ${feat.title}`, {
      description: `Operated by ${feat.roleUsedBy}`,
    });
  };

  return (
    <section className="relative border-y border-white/10 bg-[#090D1C]/80 py-12 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Complete Hospitality Ecosystem
            </span>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Engineered For Every Pillar of Hotel Operations
            </h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Click any module to inspect
          </span>
        </div>

        {/* 10 Feature Icons Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:gap-4">
          {STRIP_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.title}
                type="button"
                onClick={() => handleCardClick(feat)}
                className="group relative flex flex-col items-start text-left rounded-xl border border-white/10 bg-[#0E1428]/70 p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-[#121A33] hover:shadow-lg hover:shadow-blue-950/50 cursor-pointer"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${feat.color} p-0.5 shadow-sm shadow-black`}
                >
                  <div className="flex size-full items-center justify-center rounded-[7px] bg-[#0A0F22] transition-colors group-hover:bg-transparent">
                    <Icon className="size-5 text-white transition-colors" />
                  </div>
                </div>

                <div className="mt-3 sm:mt-3.5">
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-snug">
                    {feat.desc}
                  </p>
                </div>

                {/* Subtle bottom accent line on hover */}
                <div className="absolute inset-x-3 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Detail Inspector Modal */}
      {selectedFeature && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-blue-500/40 bg-[#0C1124] p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white"
            >
              <XIcon className="size-4" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${selectedFeature.color} text-white shadow-md`}
              >
                <selectedFeature.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedFeature.title}</h3>
                <span className="text-xs text-cyan-300 font-medium">Used by: {selectedFeature.roleUsedBy}</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
              {selectedFeature.details}
            </p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5">
                Key Architectural Capabilities:
              </div>
              <div className="space-y-2">
                {selectedFeature.capabilities.map((cap) => (
                  <div key={cap} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2Icon className="size-3.5 text-cyan-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFeature(null)}
                className="border-white/15 bg-white/5 text-white"
              >
                Close
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
                onClick={() => setSelectedFeature(null)}
              >
                <Link href="/onboarding">
                  Configure in Onboarding
                  <ArrowRightIcon className="size-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
