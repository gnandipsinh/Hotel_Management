import type { Metadata } from "next";
import Link from "next/link";
import { Building2Icon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { LoginForm } from "@/components/demo/login-form";

export const metadata: Metadata = {
  title: "Sign in — HotelSync",
  description: "Demo sign-in for the HotelSync Hotel Management SaaS panels.",
};

const BRAND_POINTS = [
  "16 customer modules — front desk to finance, in one console",
  "Multi-tenant hotels, branches and role-scoped panels",
  "A separate platform control plane for your SaaS operation",
];

/**
 * Phase 8 — demo login page (demo authentication only; production auth
 * arrives in a later phase). Split layout: brand panel on desktop,
 * form-first on mobile.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — desktop only */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <span
          aria-hidden="true"
          className="absolute -top-32 -right-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />

        <Link href="/" className="relative flex items-center gap-2.5 self-start">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Building2Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">HotelSync</span>
            <span className="text-xs text-primary-foreground/70">
              Enterprise Hotel Management SaaS
            </span>
          </span>
        </Link>

        <div className="relative flex max-w-lg flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-[0.6875rem] font-medium tracking-wide">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            Demo build · Phase 8
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">
            Run every hotel operation from one console.
          </h2>
          <ul className="flex flex-col gap-3">
            {BRAND_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-primary-foreground/85">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary-foreground/70" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative max-w-md text-xs leading-relaxed text-primary-foreground/70">
          Demo authentication only — pick any role below. No passwords, OTPs or sessions are
          verified in this phase; real authentication ships in a later phase.
        </p>
      </aside>

      {/* Form side */}
      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col text-left leading-tight">
              <span className="text-sm font-semibold">HotelSync</span>
              <span className="text-xs text-muted-foreground">
                Enterprise Hotel Management SaaS
              </span>
            </span>
          </Link>

          <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-7">
            <LoginForm next={next} />
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[0.6875rem] text-muted-foreground">
            <ShieldCheckIcon className="size-3.5" aria-hidden="true" />
            Demo environment · not production authentication
          </p>
        </div>
      </main>
    </div>
  );
}
