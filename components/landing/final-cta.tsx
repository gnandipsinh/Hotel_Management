"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  PlayCircleIcon,
  SparklesIcon,
} from "lucide-react";

interface FinalCtaProps {
  onWatchDemo?: () => void;
}

export function FinalCta({ onWatchDemo }: FinalCtaProps) {
  const trustPoints = [
    "14-Day Free Trial",
    "No Credit Card Required",
    "Setup in Under 10 Minutes",
    "24/7 Dedicated Support",
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[450px] w-full max-w-5xl bg-gradient-to-t from-blue-900/20 via-purple-900/15 to-transparent blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#101736] via-[#0C1226] to-[#080B18] px-6 py-16 text-center shadow-2xl shadow-blue-950/70 sm:px-12 lg:py-20">
          {/* Subtle decorative mesh */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <SparklesIcon className="size-3.5 text-cyan-400" />
            <span>Modernize Your Property Today</span>
          </div>

          {/* Headline */}
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance max-w-3xl mx-auto">
            Ready to Transform Your Hotel Business?
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-2xl mx-auto text-base text-slate-300 sm:text-lg leading-relaxed">
            Join over 1,200+ properties delivering seamless guest check-ins, instant UPI payments,
            and automated housekeeping turnarounds every single day.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/40 transition-all hover:scale-[1.02] hover:shadow-blue-500/60"
            >
              <span>Get Started Free</span>
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={onWatchDemo}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              <PlayCircleIcon className="size-4 text-cyan-400" />
              <span>Watch Live Demo</span>
            </button>
          </div>

          {/* Trust badges row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 border-t border-white/10 pt-8 text-xs text-slate-400">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <CheckCircle2Icon className="size-4 text-cyan-400" />
                <span className="font-medium text-slate-300">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
