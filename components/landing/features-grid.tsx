"use client";

import * as React from "react";
import {
  BarChart3Icon,
  Building2Icon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  QrCodeIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: CalendarCheckIcon,
      title: "Smart Front Desk & Live Grid",
      tag: "Front Desk & Reservations",
      description:
        "Color-coded visual room rack with instant check-ins, early arrivals, split bookings, and automated guest registration.",
      bulletPoints: ["10-second check-in flow", "Live room matrix with drag & drop", "Aadhaar & passport digital capture"],
      gradient: "from-blue-600 via-indigo-600 to-cyan-500",
      iconBg: "bg-blue-500/10 text-cyan-400 border-blue-500/30",
    },
    {
      icon: QrCodeIcon,
      title: "Contactless UPI & GST Billing",
      tag: "Payments & Compliance",
      description:
        "Dynamic UPI QR codes rendered on counter screens or mobile devices. Instant settlement with zero manual reconciliation errors.",
      bulletPoints: ["100% Indian GST compliant (SAC 9963)", "One-tap WhatsApp & SMS invoices", "Multi-tender: UPI, Card, Cash & OTA"],
      gradient: "from-cyan-500 via-blue-600 to-indigo-600",
      iconBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    },
    {
      icon: SparklesIcon,
      title: "Housekeeping & Task Dispatch",
      tag: "Daily Operations",
      description:
        "Assign room turnarounds automatically on check-out. Real-time housekeeper mobile view, clean inspection status, and minibar tracking.",
      bulletPoints: ["Automated turnaround triggers", "Housekeeper supervisor checklists", "Lost & found tracking ledger"],
      gradient: "from-indigo-600 via-purple-600 to-blue-500",
      iconBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
    {
      icon: Building2Icon,
      title: "Multi-Branch & Chain Management",
      tag: "Enterprise Scale",
      description:
        "Control all your hotels, resorts, and vacation villas from one master console. Switch between properties effortlessly with granular RBAC.",
      bulletPoints: ["Centralized brand governance", "Cross-property guest profiles", "Consolidated chain-wide P&L"],
      gradient: "from-blue-600 via-purple-600 to-indigo-500",
      iconBg: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    },
    {
      icon: UsersIcon,
      title: "Guest CRM & Loyalty Profiles",
      tag: "Guest Delight",
      description:
        "Build lifetime guest relationships. Maintain historical preferences, dietary needs, anniversary dates, and automated feedback requests.",
      bulletPoints: ["Automated pre-arrival WhatsApp", "Repeat guest recognition banner", "Special requests & allergy alerts"],
      gradient: "from-purple-600 via-indigo-600 to-cyan-500",
      iconBg: "bg-purple-500/10 text-indigo-300 border-purple-500/30",
    },
    {
      icon: BarChart3Icon,
      title: "RevPAR & Financial Intelligence",
      tag: "Analytics & Strategy",
      description:
        "Comprehensive hospitality business intelligence. Real-time ADR, RevPAR, occupancy forecasts, channel performance, and night audits.",
      bulletPoints: ["Automated daily manager report", "RevPAR & ADR trend visualizer", "Audit-ready GSTR export formats"],
      gradient: "from-cyan-500 via-indigo-600 to-blue-600",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
  ];

  return (
    <section id="features" className="relative py-20 lg:py-28 overflow-hidden bg-[#070A17]/80">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-6xl bg-blue-900/10 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-300">
            Comprehensive Platform Features
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Everything You Need to Run a Modern Hotel
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 leading-relaxed sm:text-lg">
            Built from the ground up to replace fragmented legacy point solutions with one unified,
            blazing-fast cloud operating system.
          </p>
        </div>

        {/* Features 6-Card Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0D1326]/90 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-[#111933] hover:shadow-2xl hover:shadow-blue-950/60"
              >
                {/* Top Section */}
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl border ${feature.iconBg} shadow-inner transition-transform group-hover:scale-105`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex flex-col gap-2">
                    {feature.bulletPoints.map((bp) => (
                      <div key={bp} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2Icon className="size-3.5 shrink-0 text-cyan-400" />
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle bottom gradient accent */}
                <div
                  className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
