"use client";

import * as React from "react";
import {
  BedDoubleIcon,
  BlocksIcon,
  Building2Icon,
  CheckCircle2Icon,
  Edit2Icon,
  GitBranchIcon,
  ImageIcon,
  Loader2Icon,
  QrCodeIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_MODULES } from "@/config/onboarding";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";

interface Step7Props {
  onboarding: UseOnboardingReturn;
}

export function Step7Review({ onboarding }: Step7Props) {
  const { state, goToStep, completeOnboarding, isSubmitting } = onboarding;
  const { hotel, branding, branches, property, modules, payment } = state;

  const selectedModuleConfigs = AVAILABLE_MODULES.filter((m) =>
    modules.selectedKeys.includes(m.key),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <CheckCircle2Icon className="size-4" aria-hidden="true" />
          <span>Step 7 · Verification & Activation</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Review & Launch Hotel
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm your configuration details. Once completed, your customized operations workspace will be provisioned instantly.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Section 1: Hotel Information */}
        <div className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-muted-foreground/30 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2Icon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">1. Hotel Information</h3>
                <p className="text-xs text-muted-foreground">Identity, classification & legal entity</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToStep(1)}
              className="h-8 gap-1 text-xs"
            >
              <Edit2Icon className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Hotel Name:</span>
              <p className="font-semibold text-foreground sm:text-sm">{hotel.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Legal Entity:</span>
              <p className="font-medium text-foreground">{hotel.legalName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category & Type:</span>
              <p className="font-medium text-foreground">
                {hotel.starRating} · {hotel.type}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Primary Contact:</span>
              <p className="font-medium text-foreground">
                {hotel.email} · {hotel.phone}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Address:</span>
              <p className="font-medium text-foreground">
                {hotel.address}, {hotel.city}, {hotel.state} {hotel.postalCode}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">GSTIN / Tax ID:</span>
              <p className="font-mono font-medium text-foreground uppercase">
                {hotel.gstNumber || "Not Provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Branding & Media */}
        <div className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-muted-foreground/30 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ImageIcon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">2. Hotel Branding & Showcase</h3>
                <p className="text-xs text-muted-foreground">Crest, showcase hero banner & photo gallery</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToStep(2)}
              className="h-8 gap-1 text-xs"
            >
              <Edit2Icon className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            {branding.logo && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding.logo.url}
                  alt="Hotel Logo"
                  className="size-14 rounded-lg border object-cover shadow-2xs"
                />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Hotel Crest</p>
                  <p className="text-muted-foreground">{branding.logo.originalName}</p>
                </div>
              </div>
            )}
            {branding.cover && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding.cover.url}
                  alt="Cover Banner"
                  className="h-14 w-24 rounded-lg border object-cover shadow-2xs"
                />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Cover Banner</p>
                  <p className="text-muted-foreground">{branding.cover.originalName}</p>
                </div>
              </div>
            )}
            <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs">
              <span className="text-muted-foreground">Gallery Collection:</span>
              <p className="font-semibold text-foreground">{branding.gallery.length} Photos uploaded</p>
            </div>
          </div>
        </div>

        {/* Section 3: Branches */}
        <div className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-muted-foreground/30 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GitBranchIcon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">3. Property Branches</h3>
                <p className="text-xs text-muted-foreground">
                  {branches.length} {branches.length === 1 ? "branch configured" : "branches configured"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToStep(3)}
              className="h-8 gap-1 text-xs"
            >
              <Edit2Icon className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {branches.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/20 p-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{b.name}</span>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {b.code}
                    </Badge>
                    {b.isPrimary && (
                      <Badge className="bg-primary text-primary-foreground text-[10px]">Primary</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {b.city}, {b.state || b.postalCode} · {b.phone || "No direct phone"}
                  </p>
                </div>
                {b.managerName && (
                  <span className="text-muted-foreground">Manager: {b.managerName}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Property Configuration */}
        <div className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-muted-foreground/30 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BedDoubleIcon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">4. Property Configuration</h3>
                <p className="text-xs text-muted-foreground">Floors, rooms, operational rules & tax settings</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToStep(4)}
              className="h-8 gap-1 text-xs"
            >
              <Edit2Icon className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
            <div>
              <span className="text-muted-foreground">Floors:</span>
              <p className="font-semibold text-foreground">{property.floors} Floors</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Rooms:</span>
              <p className="font-semibold text-foreground">{property.totalRooms} Rooms</p>
            </div>
            <div>
              <span className="text-muted-foreground">Check-in / Out:</span>
              <p className="font-medium text-foreground">
                {property.checkInTime} / {property.checkOutTime}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Currency & Timezone:</span>
              <p className="font-medium text-foreground">
                {property.currency} · {property.timeZone.split("/")[1] || property.timeZone}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-4 pt-2">
              <span className="text-muted-foreground">Room Categories ({property.roomCategories.length}):</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {property.roomCategories.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs font-normal">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Services & Modules */}
        <div className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-muted-foreground/30 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BlocksIcon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">5. Active Modules</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedModuleConfigs.length} operational modules enabled
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToStep(5)}
              className="h-8 gap-1 text-xs"
            >
              <Edit2Icon className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedModuleConfigs.map((m) => (
              <Badge key={m.key} variant="outline" className="gap-1.5 px-3 py-1.5 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {m.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Section 6: Payment & UPI */}
        <div className="rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-muted-foreground/30 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <QrCodeIcon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">6. Payments & Settlement</h3>
                <p className="text-xs text-muted-foreground">Direct UPI handles & merchant presentation</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToStep(6)}
              className="h-8 gap-1 text-xs"
            >
              <Edit2Icon className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Primary UPI VPA:</span>
              <p className="font-mono font-medium text-foreground">{payment.upiId || "Not Set"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payee Name:</span>
              <p className="font-medium text-foreground">{payment.displayName || hotel.legalName}</p>
            </div>
            {payment.upiQr && (
              <div className="sm:col-span-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payment.upiQr.url}
                  alt="UPI QR"
                  className="size-12 rounded-lg border object-contain bg-white p-1"
                />
                <div>
                  <p className="font-medium text-foreground">Front Desk QR Code Attached</p>
                  <p className="text-muted-foreground">{payment.upiQr.originalName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Card */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:p-8 dark:bg-primary/10">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ready to provision workspace?</h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Everything is set. Your tailored role dashboards, rooms, and front desk consoles will be prepared immediately.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          disabled={isSubmitting}
          onClick={completeOnboarding}
          className="w-full shrink-0 shadow-sm sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Provisioning Workspace...
            </>
          ) : (
            <>
              <SparklesIcon className="size-4" />
              Complete Setup
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
