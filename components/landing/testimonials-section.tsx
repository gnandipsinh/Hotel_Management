"use client";

import * as React from "react";
import { CheckCircle2Icon, StarIcon } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "General Manager",
      hotel: "The Heritage Grand Palace",
      location: "Udaipur, Rajasthan",
      rooms: "64 Rooms",
      quote:
        "Switching to HotelHub cut our front desk check-in time by more than half. Dynamic UPI payment generation at the counter saves our night auditor over 2 hours of manual reconciliation every evening. It has completely changed our operations.",
      rating: 5,
      avatarInitials: "RS",
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "Ananya Deshmukh",
      role: "Managing Director",
      hotel: "Blue Lagoon Boutique Resorts",
      location: "Goa (North & South)",
      rooms: "2 Properties · 78 Rooms",
      quote:
        "The multi-branch dashboard allows me to oversee both our Candolim and Palolem properties from my iPad wherever I am. Room matrix sync is instantaneous, and we haven't had a single double-booking in six months.",
      rating: 5,
      avatarInitials: "AD",
      color: "from-indigo-600 to-purple-600",
    },
    {
      name: "Vikramaditya Mehta",
      role: "Owner & Operator",
      hotel: "Skyview Business Hotel & Suites",
      location: "Bengaluru, Karnataka",
      rooms: "42 Rooms",
      quote:
        "Indian GST compliance was our biggest operational headache with legacy desktop software. HotelHub auto-calculates SAC codes, generates clean digital folios, and exports audit-ready reports in one click.",
      rating: 5,
      avatarInitials: "VM",
      color: "from-cyan-600 to-blue-600",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#080B18]/70 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-300">
            Real Customer Stories
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Trusted by 1,200+ Hoteliers Across India
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 leading-relaxed sm:text-lg">
            From heritage palaces in Rajasthan to beach resorts in Goa and business hotels in tech hubs,
            hoteliers choose HotelHub for uncompromising reliability.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0E1428]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-[#121933] hover:shadow-xl hover:shadow-blue-950/40"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-cyan-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-300 italic">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Author & Hotel Info */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-sm font-bold text-white shadow-md`}
                  >
                    {item.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <span title="Verified Customer" className="inline-flex">
                        <CheckCircle2Icon className="size-3.5 text-cyan-400 shrink-0" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {item.role} · <span className="text-slate-300">{item.hotel}</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span className="text-cyan-300 font-medium">{item.rooms}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
