"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BedDoubleIcon,
  BlocksIcon,
  Building2Icon,
  CheckCircle2Icon,
  GitBranchIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OnboardingState } from "@/types/onboarding";
import { AVAILABLE_MODULES } from "@/config/onboarding";

interface OnboardingSuccessProps {
  state: OnboardingState;
}

export function OnboardingSuccess({ state }: OnboardingSuccessProps) {
  const { hotel, branches, property, modules } = state;
  const primaryBranch = branches.find((b) => b.isPrimary) || branches[0];
  const activeModuleConfigs = AVAILABLE_MODULES.filter((m) =>
    modules.selectedKeys.includes(m.key),
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
      {/* Animated Success Badge */}
      <div className="relative flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-400">
        <CheckCircle2Icon className="size-10 stroke-[2.5]" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <SparklesIcon className="size-3" />
        </span>
      </div>

      <div className="mt-6 space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <ShieldCheckIcon className="size-3.5" /> Workspace Initialized
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your hotel workspace is ready.
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Welcome to HotelSync. Your tailored enterprise configuration has been applied across all staff roles and properties.
        </p>
      </div>

      {/* Property Summary Highlight Card */}
      <div className="mt-8 w-full rounded-2xl border bg-card p-6 text-left shadow-xs sm:p-7">
        <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            {state.branding.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.branding.logo.url}
                alt="Hotel Logo"
                className="size-12 rounded-xl border object-cover shadow-2xs"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2Icon className="size-6" />
              </span>
            )}
            <div>
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                {hotel.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {hotel.starRating} · {hotel.type}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="self-start text-xs sm:self-center">
            {hotel.city}, {hotel.country}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-muted/30 p-3 text-center sm:p-4">
            <span className="flex items-center justify-center text-muted-foreground">
              <GitBranchIcon className="size-4" />
            </span>
            <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
              {branches.length}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {branches.length === 1 ? "Active Branch" : "Active Branches"}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-3 text-center sm:p-4">
            <span className="flex items-center justify-center text-muted-foreground">
              <BedDoubleIcon className="size-4" />
            </span>
            <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
              {property.totalRooms}
            </p>
            <p className="text-[11px] text-muted-foreground">Rooms Configured</p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-3 text-center sm:p-4">
            <span className="flex items-center justify-center text-muted-foreground">
              <BlocksIcon className="size-4" />
            </span>
            <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
              {activeModuleConfigs.length}
            </p>
            <p className="text-[11px] text-muted-foreground">Modules Enabled</p>
          </div>
        </div>

        {/* Primary Branch Info */}
        {primaryBranch && (
          <div className="mt-4 rounded-xl border bg-muted/20 p-3.5 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              Primary Operating Branch: <span className="font-semibold">{primaryBranch.name}</span> ({primaryBranch.code})
            </p>
            <p className="mt-0.5">
              {primaryBranch.address ? `${primaryBranch.address}, ` : ""}
              {primaryBranch.city} · {primaryBranch.phone || hotel.phone}
            </p>
          </div>
        )}

        {/* Enabled Modules Pills */}
        <div className="mt-5 border-t pt-4">
          <p className="text-xs font-medium text-foreground">Activated Operational Modules:</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {activeModuleConfigs.map((m) => (
              <Badge key={m.key} variant="secondary" className="text-[11px] font-normal">
                {m.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col w-full max-w-sm gap-3 sm:flex-row sm:max-w-md sm:justify-center">
        <Button asChild size="lg" className="w-full shadow-sm">
          <Link href="/dashboard">
            <LayoutDashboardIcon className="size-4" />
            Open Hotel Dashboard
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Signed in as Hotel Super Admin. You can access all configured modules and branch controls.
      </p>
    </div>
  );
}
