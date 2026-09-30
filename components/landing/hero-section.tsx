"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  PlayCircleIcon,
  SparklesIcon,
} from "lucide-react";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

interface HeroSectionProps {
  onWatchDemo?: () => void;
}

export function HeroSection({ onWatchDemo }: HeroSectionProps) {
  const featureChecks = [
    "Multi-Branch Support",
    "GST Ready",
    "UPI Payments",
    "No Setup Fees",
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32"
    >
      {/* Background ambient lighting and gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Deep background mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[750px] w-full max-w-7xl bg-radial from-blue-900/25 via-indigo-950/15 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-48 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="flex flex-col items-start lg:col-span-5">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm shadow-blue-500/10 backdrop-blur-md">
              <SparklesIcon className="size-3.5 text-cyan-400" />
              <span>All-in-One Hotel Management Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-balance">
              Manage Your Hotel{" "}
              <span className="block mt-1 bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Smarter, Faster & Easier
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              The next-generation cloud operating system for hoteliers. Seamlessly handle reservations,
              front desk operations, housekeeping, GST-compliant invoicing, and instant UPI payments across all your properties.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/onboarding"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 -z-10 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <button
                type="button"
                onClick={onWatchDemo}
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-blue-400/40 hover:bg-white/10 hover:text-white"
              >
                <PlayCircleIcon className="size-5 text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Feature Checks */}
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 pt-6 border-t border-white/10 w-full">
              {featureChecks.map((check) => (
                <div key={check} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2Icon className="size-4 shrink-0 text-cyan-400" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Large Hotel-Management Dashboard Preview */}
          <div className="lg:col-span-7">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
