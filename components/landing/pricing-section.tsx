"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  SparklesIcon,
} from "lucide-react";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      description: "Ideal for boutique hotels, homestays, and B&Bs with essential front desk needs.",
      priceMonthly: 2499,
      priceAnnual: 1999,
      rooms: "Up to 20 Rooms",
      popular: false,
      features: [
        "Up to 20 Rooms Included",
        "Visual Room Rack & Booking Grid",
        "GST-Compliant Invoicing (SAC 9963)",
        "Counter Dynamic UPI QR Payments",
        "Digital Guest Profiles & ID Capture",
        "Daily Housekeeping Turnaround Sheet",
        "Standard Email & Ticket Support",
      ],
      ctaText: "Get Started Free",
      ctaHref: "/onboarding",
    },
    {
      name: "Professional",
      description: "Our flagship tier for growing hotels and luxury resorts demanding complete automation.",
      priceMonthly: 5999,
      priceAnnual: 4799,
      rooms: "Up to 60 Rooms",
      popular: true,
      features: [
        "Up to 60 Rooms Included",
        "Multi-Branch Control (Up to 3 Properties)",
        "Restaurant / F&B POS & KOT Generation",
        "Automated WhatsApp & SMS Alerts",
        "14 Role-Based Staff Dashboards",
        "Advanced ADR, RevPAR & Cashbook Analytics",
        "Dynamic Rates & Peak Season Rules",
        "24/7 Priority Hospitality Helpline",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaHref: "/onboarding",
    },
    {
      name: "Enterprise",
      description: "Custom scale for large luxury resort chains, hotel groups, and enterprise portfolios.",
      priceMonthly: 12999,
      priceAnnual: 10399,
      rooms: "Unlimited Rooms & Chains",
      popular: false,
      features: [
        "Unlimited Rooms & Hotel Branches",
        "Zero-Commission Hotel Website Builder",
        "Multi-GSTIN & Corporate Central Billing",
        "Full Channel Manager API & Webhooks",
        "Dedicated Account Executive & Training",
        "Custom Staff RBAC & Audit Log Archive",
        "Enterprise 99.9% Uptime SLA Guarantee",
      ],
      ctaText: "Contact Enterprise",
      ctaHref: "/onboarding",
    },
  ];

  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-full max-w-6xl bg-purple-900/10 blur-[150px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-300">
            Transparent Pricing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Predictable Investment for Your Property
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 leading-relaxed sm:text-lg">
            No surprise commissions, no setup fees, and no lock-in contracts. Switch or cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center rounded-xl border border-white/10 bg-[#0E1428] p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const price =
              billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-blue-500/80 bg-gradient-to-b from-[#131A38] to-[#0C1226] p-6 sm:p-8 shadow-2xl shadow-blue-600/25 lg:-translate-y-3"
                    : "border border-white/10 bg-[#0E1428]/80 p-6 sm:p-8 hover:border-white/20 hover:bg-[#111830]"
                }`}
              >
                {/* Popular Radiant Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-blue-500/40 uppercase tracking-wider">
                      <SparklesIcon className="size-3.5" />
                      Most Popular Choice
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                      {plan.rooms}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {billingCycle === "annual"
                      ? "Billed annually (₹" +
                        (price * 12).toLocaleString("en-IN") +
                        "/year) · GST extra"
                      : "Billed monthly · GST extra"}
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      What&apos;s Included:
                    </span>
                    <div className="mt-4 flex flex-col gap-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2Icon
                            className={`size-4 shrink-0 mt-0.5 ${
                              plan.popular ? "text-cyan-400" : "text-blue-400"
                            }`}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    href={plan.ctaHref}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/40 hover:scale-[1.02] hover:shadow-blue-500/60"
                        : "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRightIcon className="size-4" />
                  </Link>
                  <p className="mt-2 text-center text-[10px] text-slate-400">
                    Instant setup · No credit card needed
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
