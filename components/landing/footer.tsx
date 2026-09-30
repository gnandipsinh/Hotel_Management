"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2Icon,
  CheckCircle2Icon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  PhoneIcon,
  SendIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LandingFooter() {
  const [newsletterEmail, setNewsletterEmail] = React.useState("");

  // Callback request form state
  const [hotelName, setHotelName] = React.useState("");
  const [hotelPhone, setHotelPhone] = React.useState("");
  const [hotelRooms, setHotelRooms] = React.useState("20-50 Rooms");
  const [callbackSent, setCallbackSent] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    toast.success("Thank you for subscribing!", {
      description: "You will receive our bi-weekly Indian hotel industry & RevPAR trends briefing.",
    });
    setNewsletterEmail("");
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName.trim() || !hotelPhone.trim()) {
      toast.error("Please fill in your hotel name and contact phone number.");
      return;
    }
    setCallbackSent(true);
    toast.success(`Demo request received for ${hotelName}!`, {
      description: `Our hospitality advisor will WhatsApp/call you on ${hotelPhone} within 15 minutes.`,
    });
  };

  return (
    <footer id="contact" className="border-t border-white/10 bg-[#060813] text-slate-400">
      {/* Quick Contact & Callback Banner */}
      <div className="border-b border-white/10 bg-[#090D1F] py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Direct Indian Hoteliers Hotline
              </span>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
                Speak With a Hotel Systems Specialist
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Need a guided migration from your existing desktop PMS (IDS Next, ShawMan, Opera, eZee)?
                Our onboarding team helps migrate rooms, guest profiles, and open folios with zero downtime.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="size-3.5 text-cyan-400" />
                  <span className="font-semibold text-white">+91 1800-419-HOTEL</span>
                  <span className="text-slate-500">(Toll-Free, 24/7 Helpline)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="size-3.5 text-cyan-400" />
                  <span>support@hotelhub.in · enterprise@hotelhub.in</span>
                </div>
              </div>
            </div>

            {/* Quick Callback Form */}
            <div className="lg:col-span-7 rounded-2xl border border-blue-500/30 bg-[#0C1228] p-5 shadow-xl">
              {callbackSent ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2Icon className="size-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Callback Request Confirmed!</h4>
                  <p className="text-xs text-slate-400 max-w-md">
                    Thank you, {hotelName}. Our senior hotel systems consultant will contact you at {hotelPhone} shortly.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCallbackSent(false);
                      setHotelName("");
                      setHotelPhone("");
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 mt-2"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <PhoneCallIcon className="size-3.5 text-cyan-400" />
                      Request a 15-Minute Priority Callback
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium">Average response: 8 mins</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder="Hotel / Resort Name"
                        className="h-9 w-full rounded-lg border border-white/10 bg-[#080B1A] px-3 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={hotelPhone}
                        onChange={(e) => setHotelPhone(e.target.value)}
                        placeholder="Phone / WhatsApp (+91)"
                        className="h-9 w-full rounded-lg border border-white/10 bg-[#080B1A] px-3 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={hotelRooms}
                        onChange={(e) => setHotelRooms(e.target.value)}
                        className="h-9 w-full rounded-lg border border-white/10 bg-[#080B1A] px-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="1-20 Rooms">1 to 20 Rooms</option>
                        <option value="20-50 Rooms">20 to 50 Rooms</option>
                        <option value="50-100 Rooms">50 to 100 Rooms</option>
                        <option value="100+ Rooms / Chain">100+ Rooms (Hotel Chain)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">
                      No commitment required. Free data migration assistance included.
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/30 hover:scale-[1.02] transition-transform"
                    >
                      <SendIcon className="size-3" />
                      <span>Request Callback</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/25">
                <div className="flex size-full items-center justify-center rounded-[11px] bg-[#0A0E1A]">
                  <Building2Icon className="size-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  Hotel<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Hub</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Hospitality Operating System
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-400">
              The premier all-in-one cloud PMS for independent hotels, luxury resorts, and multi-branch
              hospitality groups. Engineered for speed, 100% GST compliance, and seamless UPI payments.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-3.5 text-cyan-400" />
                <span>+91 1800-419-HOTEL (Toll Free 24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="size-3.5 text-cyan-400" />
                <span>contact@hotelhub.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-3.5 text-cyan-400" />
                <span>Indiranagar, Bengaluru · BKC, Mumbai</span>
              </div>
            </div>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="mt-6 flex max-w-sm gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter hotel email..."
                className="h-9 w-full rounded-lg border border-white/10 bg-[#0E1428] px-3 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Front Desk PMS</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Live Room Matrix</a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">Dynamic UPI QR</a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">GST Invoicing (SAC 9963)</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Housekeeping App</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Multi-Branch Hub</a>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">Hotel Website Builder</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a href="#why-hotelhub" className="hover:text-white transition-colors">Boutique Hotels</a>
              </li>
              <li>
                <a href="#why-hotelhub" className="hover:text-white transition-colors">Luxury Resorts</a>
              </li>
              <li>
                <a href="#why-hotelhub" className="hover:text-white transition-colors">Business Hotels</a>
              </li>
              <li>
                <a href="#why-hotelhub" className="hover:text-white transition-colors">Hotel Chains & Groups</a>
              </li>
              <li>
                <a href="#why-hotelhub" className="hover:text-white transition-colors">Homestays & Villas</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Demo Consoles</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Transparent Pricing</a>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">14-Day Free Trial</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">14 Role Test Panels</Link>
              </li>
              <li>
                <span className="text-slate-400">GST Compliance Guide</span>
              </li>
              <li>
                <span className="text-slate-400">Cloud Security SLA</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} HotelHub Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheckIcon className="size-4" />
              100% Indian GST & UPI Certified
            </span>
            <span>•</span>
            <span className="text-slate-400">ISO 27001 Cloud Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
