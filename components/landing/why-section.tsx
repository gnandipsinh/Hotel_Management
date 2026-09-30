"use client";

import * as React from "react";
import Image from "next/image";
import {
  CheckIcon,
  HeadphonesIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";

interface WhySectionProps {
  onWatchDemo?: () => void;
}

export function WhySection({ onWatchDemo }: WhySectionProps) {
  const stats = [
    {
      value: "99.8%",
      label: "System Uptime",
      description: "Enterprise cloud infrastructure with zero downtime during peak check-in hours.",
      icon: ZapIcon,
      color: "from-blue-500 to-cyan-400",
    },
    {
      value: "45%",
      label: "Faster Check-ins",
      description: "Quick guest lookup, digital ID verification, and 10-second room key handover.",
      icon: TrendingUpIcon,
      color: "from-indigo-500 to-purple-400",
    },
    {
      value: "3.2x",
      label: "Revenue Growth",
      description: "Integrated commission-free booking engine, dynamic rate plans, and POS upselling.",
      icon: SparklesIcon,
      color: "from-cyan-400 to-blue-500",
    },
    {
      value: "24/7",
      label: "Dedicated Support",
      description: "Hospitality specialist assistance via phone, WhatsApp, and live chat within 3 minutes.",
      icon: HeadphonesIcon,
      color: "from-purple-500 to-indigo-400",
    },
  ];

  const valueProps = [
    "Replaces 5+ disconnected legacy tools with one synchronized cloud OS",
    "Zero installation needed — runs seamlessly on Mac, Windows, iPad & mobile",
    "Full Indian GST compliance with automated SAC codes and GSTR reporting",
    "Instant UPI dynamic QR codes on front desk terminals with zero manual error",
  ];

  return (
    <section id="why-hotelhub" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Luxury Hotel Image & Video Card */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0D1226] p-2 shadow-2xl shadow-blue-950/40">
              {/* Hotel Image with ambient overlays */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                  alt="Luxury Hotel Exterior and Pool"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D1C] via-[#090D1C]/40 to-transparent" />

                {/* Video Play Button Overlay */}
                <button
                  type="button"
                  onClick={onWatchDemo}
                  className="group absolute inset-0 flex flex-col items-center justify-center gap-3 transition-colors"
                  aria-label="Play HotelHub overview video"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-xl shadow-blue-600/50 backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-blue-500">
                    <PlayIcon className="ml-1 size-7 fill-white" />
                  </div>
                  <span className="rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md group-hover:bg-black/80">
                    Watch 2-Min Platform Walkthrough
                  </span>
                </button>

                {/* Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">Live Hotel Ops Active</span>
                </div>

                {/* Bottom Stats Floating Chip */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-[#0B1024]/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
                  <ShieldCheckIcon className="size-4 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-200">
                    Trusted by <strong className="text-white">1,200+</strong> Properties
                  </span>
                </div>
              </div>

              {/* Bottom Card Summary Bar */}
              <div className="mt-3 flex items-center justify-between px-3 py-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <SparklesIcon className="size-3.5 text-blue-400" />
                  Zero hardware installation required
                </span>
                <span className="text-cyan-400 font-medium">99.8% Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Description & Value Points */}
          <div className="flex flex-col items-start lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-blue-400">
              Why HotelHub
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
              Designed Exclusively for Modern Hospitality Operators
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Traditional hotel software is clunky, fragmented, and prone to costly manual mistakes.
              HotelHub delivers an intuitive, unified operating system that brings front desk,
              instant UPI billing, housekeeping, and multi-property analytics into one cohesive interface.
            </p>

            {/* Checklist */}
            <div className="mt-6 flex flex-col gap-3 w-full">
              {valueProps.map((prop) => (
                <div key={prop} className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-cyan-400 mt-0.5">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{prop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Statistics Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E1428]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-[#121A33] hover:shadow-xl hover:shadow-blue-950/40"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`bg-gradient-to-r ${stat.color} bg-clip-text text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent`}
                  >
                    {stat.value}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-blue-400 border border-white/10 group-hover:border-blue-500/30">
                    <Icon className="size-5" />
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-semibold text-white">
                    {stat.label}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
