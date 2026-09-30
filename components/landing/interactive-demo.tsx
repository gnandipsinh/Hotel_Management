"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  FileTextIcon,
  QrCodeIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function InteractiveDemoSection() {
  const [activeTab, setActiveTab] = React.useState<"upi" | "gst" | "roles">("upi");

  // UPI Simulator State
  const [upiAmount, setUpiAmount] = React.useState<number>(4800);
  const [upiGuest, setUpiGuest] = React.useState<string>("Siddharth Rao");
  const [upiRoom, setUpiRoom] = React.useState<string>("Room 102 - Deluxe King");
  const [upiPaid, setUpiPaid] = React.useState<boolean>(false);
  const [qrGenerating, setQrGenerating] = React.useState<boolean>(false);

  // GST Calculator State
  const [roomTariff, setRoomTariff] = React.useState<number>(5500);
  const [nights, setNights] = React.useState<number>(2);
  const isHigherGstSlab = roomTariff > 7500;
  const gstRate = isHigherGstSlab ? 18 : 12;
  const subtotal = roomTariff * nights;
  const gstAmount = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + gstAmount;

  // Selected Demo Role
  const [selectedRole, setSelectedRole] = React.useState<string>("hotel_manager");

  const ROLES = [
    {
      id: "hotel_manager",
      title: "General Manager",
      icon: UsersIcon,
      modules: ["Full Front Desk", "RevPAR Analytics", "Staff Rosters", "Financial Ledgers"],
      description: "Complete visibility across all property operations, ADR forecasts, and department KPIs.",
    },
    {
      id: "receptionist",
      title: "Front Desk Receptionist",
      icon: CreditCardIcon,
      modules: ["Live Room Rack", "Fast Check-in/out", "UPI Counter QR", "Guest Folios"],
      description: "10-second check-in, Aadhaar/Passport scan, and instant contactless UPI billing.",
    },
    {
      id: "housekeeping",
      title: "Housekeeping Supervisor",
      icon: SparklesIcon,
      modules: ["Turnaround Board", "Room Inspections", "Minibar Restock", "Lost & Found"],
      description: "Real-time room cleanliness statuses and mobile task dispatch for room attendants.",
    },
    {
      id: "super_admin",
      title: "Platform Super Admin",
      icon: ShieldCheckIcon,
      modules: ["Multi-Tenant Control", "Hotel Subscriptions", "Global Audit Logs", "System Health"],
      description: "Master control plane for SaaS operators to manage hotel tenants and module entitlements.",
    },
  ];

  const handleSimulatePayment = () => {
    setQrGenerating(true);
    setTimeout(() => {
      setQrGenerating(false);
      setUpiPaid(true);
      toast.success(`Payment of ₹${upiAmount.toLocaleString("en-IN")} Received!`, {
        description: `Paid via Google Pay · Ref: UPI-${Math.floor(100000 + Math.random() * 900000)} · Folio closed.`,
      });
    }, 900);
  };

  const handleResetUpi = () => {
    setUpiPaid(false);
  };

  return (
    <section id="demo" className="relative py-20 lg:py-28 overflow-hidden bg-[#0A0D1F] border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-full max-w-6xl bg-blue-900/15 blur-[160px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-300">
            Interactive Live Sandbox
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            Test HotelHub Workflows Live
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 leading-relaxed sm:text-lg">
            No signup or credit card required. Experience how HotelHub automates daily hotel operations,
            instant UPI settlement, and Indian GST accounting.
          </p>

          {/* Interactive Mode Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#0E1530] p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab("upi")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                activeTab === "upi"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <QrCodeIcon className="size-4" />
              <span>Dynamic UPI QR Generator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("gst")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                activeTab === "gst"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ReceiptIcon className="size-4" />
              <span>GST Hospitality Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("roles")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                activeTab === "roles"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UsersIcon className="size-4" />
              <span>14 Role Console Switcher</span>
            </button>
          </div>
        </div>

        {/* Tab 1: UPI Generator Simulator */}
        {activeTab === "upi" && (
          <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-blue-500/30 bg-[#0E1530]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center">
              {/* Left: Input Form */}
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400">
                    <QrCodeIcon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Front Desk UPI Payment Terminal</h3>
                    <p className="text-xs text-slate-400">0% transaction fees · Direct bank settlement</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Guest Name</label>
                  <input
                    type="text"
                    value={upiGuest}
                    onChange={(e) => setUpiGuest(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0A0E22] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300">Room / Folio</label>
                    <input
                      type="text"
                      value={upiRoom}
                      onChange={(e) => setUpiRoom(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#0A0E22] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">Tariff Amount (₹)</label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#0A0E22] px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#090D1C] p-3 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Tax Surcharge:</span>
                    <span className="text-white font-mono">₹0.00 (Zero MDR)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target VPA:</span>
                    <span className="text-cyan-300 font-mono">thegrandpalace@icici</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Window:</span>
                    <span className="text-emerald-400 font-medium">T+0 Instant RTGS</span>
                  </div>
                </div>

                {upiPaid ? (
                  <button
                    type="button"
                    onClick={handleResetUpi}
                    className="w-full rounded-xl bg-white/10 py-3 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    Reset & Test Another Payment
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={qrGenerating}
                    onClick={handleSimulatePayment}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:scale-[1.01] transition-transform"
                  >
                    {qrGenerating ? (
                      <span>Simulating Network Handshake...</span>
                    ) : (
                      <>
                        <QrCodeIcon className="size-4" />
                        <span>Simulate Guest UPI Scan & Pay</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Right: Realistic Dynamic QR Preview */}
              <div className="md:col-span-6 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-xs rounded-2xl border-2 border-blue-500/40 bg-gradient-to-b from-[#141C3D] to-[#0A0E22] p-6 text-center shadow-2xl">
                  {upiPaid ? (
                    <div className="py-8 flex flex-col items-center justify-center space-y-3">
                      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                        <CheckCircle2Icon className="size-10" />
                      </div>
                      <div className="text-lg font-bold text-white">Payment Confirmed!</div>
                      <div className="text-2xl font-mono font-extrabold text-cyan-300">
                        ₹{upiAmount.toLocaleString("en-IN")}
                      </div>
                      <p className="text-xs text-slate-300">
                        Folio #INV-9204 auto-reconciled. Room key activated.
                      </p>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                        Verified by NPCI UPI Switch
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white">
                        <span>BHARAT UPI QR</span>
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.2 text-[10px] text-cyan-300">Dynamic</span>
                      </div>

                      {/* QR Display */}
                      <div className="my-4 mx-auto flex size-44 items-center justify-center rounded-xl bg-white p-3 shadow-inner">
                        <svg className="size-full" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner markers */}
                          <rect x="5" y="5" width="26" height="26" fill="#0C1226" />
                          <rect x="9" y="9" width="18" height="18" fill="white" />
                          <rect x="13" y="13" width="10" height="10" fill="#0284C7" />

                          <rect x="69" y="5" width="26" height="26" fill="#0C1226" />
                          <rect x="73" y="9" width="18" height="18" fill="white" />
                          <rect x="77" y="13" width="10" height="10" fill="#0284C7" />

                          <rect x="5" y="69" width="26" height="26" fill="#0C1226" />
                          <rect x="9" y="73" width="18" height="18" fill="white" />
                          <rect x="13" y="77" width="10" height="10" fill="#0284C7" />

                          {/* Data elements */}
                          <rect x="36" y="10" width="8" height="8" fill="#1E293B" />
                          <rect x="48" y="10" width="12" height="8" fill="#1E293B" />
                          <rect x="36" y="24" width="24" height="8" fill="#1E293B" />
                          <rect x="10" y="38" width="80" height="6" fill="#1E293B" />
                          <rect x="10" y="48" width="30" height="14" fill="#0284C7" />
                          <rect x="45" y="48" width="45" height="14" fill="#1E293B" />
                          <rect x="36" y="68" width="16" height="24" fill="#1E293B" />
                          <rect x="58" y="68" width="32" height="24" fill="#1E293B" />
                        </svg>
                      </div>

                      <div className="font-mono text-xl font-bold text-white">
                        ₹{upiAmount.toLocaleString("en-IN")}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </div>
                      <div className="mt-2 text-[10px] text-cyan-400 font-mono">
                        Valid for 09:42 minutes
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GST Hospitality Calculator */}
        {activeTab === "gst" && (
          <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-blue-500/30 bg-[#0E1530]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center">
              {/* Left Controls */}
              <div className="md:col-span-6 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400">
                    <ReceiptIcon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Indian GST Hospitality Slabs</h3>
                    <p className="text-xs text-slate-400">SAC Code 9963 · Dual slab compliance</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Room Tariff per Night</span>
                    <span className="font-mono font-bold text-cyan-300">₹{roomTariff.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={15000}
                    step={500}
                    value={roomTariff}
                    onChange={(e) => setRoomTariff(Number(e.target.value))}
                    className="mt-2 w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>₹1,000 (12% GST)</span>
                    <span>Threshold ₹7,500</span>
                    <span>₹15,000 (18% GST)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Duration of Stay</span>
                    <span className="font-bold text-white">{nights} Nights</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 5, 7].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNights(n)}
                        className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                          nights === n
                            ? "bg-blue-600 text-white"
                            : "border border-white/10 bg-[#0A0E22] text-slate-400 hover:text-white"
                        }`}
                      >
                        {n}N
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A0E22] p-4 text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Applicable GST Slab:</span>
                    <span className="font-semibold text-white">
                      {isHigherGstSlab ? "18% (Tariff > ₹7,500)" : "12% (Tariff ≤ ₹7,500)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Central GST (CGST):</span>
                    <span className="font-mono text-cyan-300">
                      {gstRate / 2}% = ₹{(gstAmount / 2).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>State GST (SGST):</span>
                    <span className="font-mono text-cyan-300">
                      {gstRate / 2}% = ₹{(gstAmount / 2).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Live Invoice Folio */}
              <div className="md:col-span-6">
                <div className="rounded-2xl border border-white/15 bg-[#090D1C] p-5 shadow-inner space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <div className="text-xs font-bold text-white">HOTELHUB TAX INVOICE</div>
                      <div className="text-[10px] text-slate-400">GSTIN: 27AABCT8491M1Z3</div>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                      SAC 9963
                    </span>
                  </div>

                  <div className="text-xs space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Room Charges ({nights} Nights × ₹{roomTariff.toLocaleString("en-IN")})</span>
                      <span className="font-mono font-semibold text-white">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>CGST ({gstRate / 2}%)</span>
                      <span className="font-mono text-slate-300">
                        ₹{(gstAmount / 2).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>SGST ({gstRate / 2}%)</span>
                      <span className="font-mono text-slate-300">
                        ₹{(gstAmount / 2).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                      <span>Total Amount Payable</span>
                      <span className="font-mono text-cyan-300">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => toast.success("Tax Invoice PDF Generated for Folio #INV-9410")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold py-2"
                  >
                    <FileTextIcon className="size-3.5 mr-1" />
                    Download Sample GST Folio PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 14 Staff Roles Explorer */}
        {activeTab === "roles" && (
          <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-blue-500/30 bg-[#0E1530]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-white">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-300">
                Each team member logs into a tailored panel restricted to their operational duty.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      toast.info(`Switched spotlight to ${role.title}`);
                    }}
                    className={`flex flex-col text-left rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/20 scale-[1.02]"
                        : "border-white/10 bg-[#090D1C] hover:border-white/20 hover:bg-[#0E1428]"
                    }`}
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-cyan-400">
                      <Icon className="size-5" />
                    </div>
                    <div className="mt-3 font-bold text-sm text-white">{role.title}</div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-snug">{role.description}</p>
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                      {role.modules.map((m) => (
                        <div key={m} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                          <CheckCircle2Icon className="size-3 text-cyan-400" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#080C1B] p-4">
              <div className="text-xs text-slate-300">
                Ready to explore all 14 roles in action? Test every panel with real credentials.
              </div>
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                <Link href="/login">
                  Launch 14-Role Demo Console
                  <ArrowRightIcon className="size-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
