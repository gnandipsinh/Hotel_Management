import Link from "next/link";
import {
  BarChart3Icon,
  BedDoubleIcon,
  Building2Icon,
  CalendarCheckIcon,
  ConciergeBellIcon,
  GlobeIcon,
  PackageIcon,
  ReceiptTextIcon,
  SparklesIcon,
  UtensilsCrossedIcon,
  UserCogIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import { LandingActions } from "@/components/demo/landing-actions";
import { Button } from "@/components/ui/button";
import { ROLE_PANELS } from "@/config/demo";

const FEATURE_CARDS = [
  {
    icon: CalendarCheckIcon,
    title: "Bookings & Calendar",
    description: "Reservations, calendar matrix and rate-aware booking flow.",
  },
  {
    icon: ConciergeBellIcon,
    title: "Reception & Desk",
    description: "Arrivals, departures and room assignment at the front desk.",
  },
  {
    icon: BedDoubleIcon,
    title: "Rooms & Units",
    description: "Room directory, types, rates and live status grids.",
  },
  {
    icon: UsersIcon,
    title: "Guest Directory",
    description: "Guest profiles, stay history and preferences.",
  },
  {
    icon: SparklesIcon,
    title: "Housekeeping",
    description: "Room boards, task assignment and turnaround tracking.",
  },
  {
    icon: UtensilsCrossedIcon,
    title: "Restaurant & POS",
    description: "Orders, KOT and menu engineering for F&B.",
  },
  {
    icon: PackageIcon,
    title: "Inventory & Stock",
    description: "Store ledgers, purchase tracking and par levels.",
  },
  {
    icon: WrenchIcon,
    title: "Maintenance",
    description: "Work orders, preventive schedules and asset health.",
  },
  {
    icon: ReceiptTextIcon,
    title: "Billing & Finance",
    description: "GST invoices, guest folios and UPI payments.",
  },
  {
    icon: UserCogIcon,
    title: "Staff & Shifts",
    description: "Rosters, attendance and role-based staff panels.",
  },
  {
    icon: BarChart3Icon,
    title: "Reports & ADR",
    description: "Occupancy, revenue and performance reporting.",
  },
  {
    icon: GlobeIcon,
    title: "Website & AI Add-Ons",
    description: "Hotel website builder plus an AI staff assistant.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Pick a demo role",
    description:
      "Choose from 14 demo roles — platform super admin, hotel owner, manager, receptionist and every specialist panel.",
  },
  {
    step: "02",
    title: "Land in your panel",
    description:
      "Role-based routing opens the correct dashboard with a sidebar scoped to that role's module access and hotel plan.",
  },
  {
    step: "03",
    title: "Switch anytime",
    description:
      "The demo switcher swaps users instantly so you can test every panel, route guard and tenant boundary.",
  },
];

const DEMO_ROLE_LABELS = Object.values(ROLE_PANELS);

/**
 * Landing page (Phase 8). Entry point of the demo flow:
 * Landing → Login → Demo user → Session → Role panel.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">HotelSync</span>
          </Link>
          <nav aria-label="Landing" className="ml-auto hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#modules" className="transition-colors hover:text-foreground">
              Modules
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>
          <Button asChild size="sm" variant="outline" className="ml-auto md:ml-3">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="flex max-w-3xl flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[0.6875rem] font-semibold tracking-wider text-primary uppercase">
              <SparklesIcon className="size-3.5" aria-hidden="true" />
              Multi-tenant Hotel Management SaaS · Demo build
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Run every hotel operation from one console.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Bookings, front desk, housekeeping, F&amp;B, finance and staff — organized per hotel,
              per branch and per role, with a separate platform control plane for your SaaS team.
            </p>
            <LandingActions />
            <p className="text-xs text-muted-foreground">
              Demo authentication only — no real credentials are verified in this build.
            </p>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "14", label: "Demo roles" },
              { value: "3", label: "Demo hotels" },
              { value: "16", label: "Customer modules" },
              { value: "2", label: "Panels (hotel + platform)" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Modules */}
        <section id="modules" className="border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Every module, one platform</h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Each module is entitlement-driven — hotels only see the modules their plan
                enables, and each role only sees what its access grants allow.
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURE_CARDS.map((card) => (
                <li
                  key={card.title}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <card.icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{card.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">How the demo works</h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                The complete flow — landing, login, session, role routing and route protection —
                wired for every panel in the architecture.
              </p>
            </div>
            <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {STEPS.map((item) => (
                <li key={item.step} className="rounded-xl border bg-card p-5">
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-2">
              {DEMO_ROLE_LABELS.map((route) => (
                <code
                  key={route}
                  className="rounded-md border bg-muted/60 px-2 py-1 text-[0.6875rem] text-muted-foreground"
                >
                  {route}
                </code>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>HotelSync — Enterprise Hotel Management SaaS · Phase 8 demo build</p>
          <p>
            Demo authentication only — not production security. Real authentication ships in a
            later phase.
          </p>
        </div>
      </footer>
    </div>
  );
}
