"use client";

import * as React from "react";
import {
  BedDoubleIcon,
  ClockIcon,
  PlusIcon,
  SlidersIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CURRENCY_OPTIONS,
  ROOM_CATEGORY_PRESETS,
  TIMEZONE_OPTIONS,
} from "@/config/onboarding";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";

interface Step4Props {
  onboarding: UseOnboardingReturn;
}

export function Step4PropertyConfig({ onboarding }: Step4Props) {
  const {
    state,
    errors,
    updateProperty,
    addRoomCategory,
    removeRoomCategory,
  } = onboarding;
  const { property } = state;

  const [newCategoryInput, setNewCategoryInput] = React.useState("");

  const handleAddCustomCategory = () => {
    if (!newCategoryInput.trim()) return;
    addRoomCategory(newCategoryInput.trim());
    setNewCategoryInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomCategory();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <SlidersIcon className="size-4" aria-hidden="true" />
          <span>Step 4 · Capacity & Rules</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Property Configuration
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define physical building capacities, standard check-in timings, operating currency, and tax accounting.
        </p>
      </div>

      {/* Building Scale & Capacity */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Capacity & Floor Structure</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Sets your baseline room grid dimensions and housekeeping zone allocations.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Floors */}
          <div className="space-y-1.5">
            <Label htmlFor="floors-count" className="text-xs font-medium">
              Number of Floors <span className="text-destructive">*</span>
            </Label>
            <Input
              id="floors-count"
              type="number"
              min={1}
              max={120}
              value={property.floors || ""}
              onChange={(e) => updateProperty({ floors: Number(e.target.value) })}
              className={errors.floors ? "border-destructive" : ""}
            />
            {errors.floors && (
              <p className="text-xs font-medium text-destructive">{errors.floors}</p>
            )}
          </div>

          {/* Rooms */}
          <div className="space-y-1.5">
            <Label htmlFor="rooms-count" className="text-xs font-medium">
              Total Room Count <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rooms-count"
              type="number"
              min={1}
              max={5000}
              value={property.totalRooms || ""}
              onChange={(e) => updateProperty({ totalRooms: Number(e.target.value) })}
              className={errors.totalRooms ? "border-destructive" : ""}
            />
            {errors.totalRooms && (
              <p className="text-xs font-medium text-destructive">{errors.totalRooms}</p>
            )}
          </div>
        </div>
      </section>

      {/* Room Categories */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Room Categories & Types <span className="text-destructive">*</span>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Configure room inventory tiers for dynamic pricing, calendar availability, and reservations.
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {property.roomCategories.length} Types Configured
          </Badge>
        </div>

        {/* Existing Categories */}
        <div className="mt-5 flex flex-wrap gap-2">
          {property.roomCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <BedDoubleIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span>{category}</span>
              <button
                type="button"
                onClick={() => removeRoomCategory(category)}
                aria-label={`Remove category ${category}`}
                className="ml-1 rounded-sm text-muted-foreground hover:text-destructive focus:outline-hidden"
              >
                <XIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Category Input */}
        <div className="mt-4 flex max-w-md items-center gap-2">
          <Input
            placeholder="Add custom category (e.g. Royal Lake Villa)"
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 text-xs"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddCustomCategory}
            disabled={!newCategoryInput.trim()}
          >
            <PlusIcon className="size-3.5" />
            Add
          </Button>
        </div>

        {/* Preset Suggestions */}
        <div className="mt-4 border-t pt-3">
          <p className="text-[11px] text-muted-foreground">Quick Suggestions:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ROOM_CATEGORY_PRESETS.filter((p) => !property.roomCategories.includes(p)).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addRoomCategory(preset)}
                className="rounded-md border border-dashed px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>
        {errors.roomCategories && (
          <p className="mt-2 text-xs font-medium text-destructive">{errors.roomCategories}</p>
        )}
      </section>

      {/* Operational Policies & Timings */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Operational Hours & Standards</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Standard guest check-in / check-out windows enforced on booking slips and day audits.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Check-in Time */}
          <div className="space-y-1.5">
            <Label htmlFor="checkin-time" className="text-xs font-medium">
              Standard Check-In Time <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <ClockIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="checkin-time"
                type="time"
                value={property.checkInTime}
                onChange={(e) => updateProperty({ checkInTime: e.target.value })}
                className="pl-9"
              />
            </div>
            {errors.checkInTime && (
              <p className="text-xs font-medium text-destructive">{errors.checkInTime}</p>
            )}
          </div>

          {/* Check-out Time */}
          <div className="space-y-1.5">
            <Label htmlFor="checkout-time" className="text-xs font-medium">
              Standard Check-Out Time <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <ClockIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="checkout-time"
                type="time"
                value={property.checkOutTime}
                onChange={(e) => updateProperty({ checkOutTime: e.target.value })}
                className="pl-9"
              />
            </div>
            {errors.checkOutTime && (
              <p className="text-xs font-medium text-destructive">{errors.checkOutTime}</p>
            )}
          </div>
        </div>
      </section>

      {/* Regional & Financial Settings */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Regional Localization & Taxes</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Currency, operating timezone, and GST tax invoice treatment.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Currency */}
          <div className="space-y-1.5">
            <Label htmlFor="currency-select" className="text-xs font-medium">
              Default Currency <span className="text-destructive">*</span>
            </Label>
            <Select
              value={property.currency}
              onValueChange={(val) => updateProperty({ currency: val })}
            >
              <SelectTrigger id="currency-select">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Zone */}
          <div className="space-y-1.5">
            <Label htmlFor="timezone-select" className="text-xs font-medium">
              Property Time Zone <span className="text-destructive">*</span>
            </Label>
            <Select
              value={property.timeZone}
              onValueChange={(val) => updateProperty({ timeZone: val })}
            >
              <SelectTrigger id="timezone-select">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Week Start */}
          <div className="space-y-1.5">
            <Label htmlFor="weekstart-select" className="text-xs font-medium">
              Calendar Week Starts On
            </Label>
            <Select
              value={property.weekStart}
              onValueChange={(val) =>
                updateProperty({ weekStart: val as "monday" | "sunday" })
              }
            >
              <SelectTrigger id="weekstart-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday (Hospitality Standard)</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GST Tax Slabs */}
          <div className="space-y-1.5">
            <Label htmlFor="gst-slab-select" className="text-xs font-medium">
              Default GST / Hospitality Tax Rate
            </Label>
            <Select
              value={String(property.gstRate)}
              onValueChange={(val) => updateProperty({ gstRate: Number(val) })}
            >
              <SelectTrigger id="gst-slab-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (Exempt / No Tax)</SelectItem>
                <SelectItem value="5">5% (Economy / Special Slabs)</SelectItem>
                <SelectItem value="12">12% (Rooms below ₹7,500/night)</SelectItem>
                <SelectItem value="18">18% (Rooms above ₹7,500/night & Luxury)</SelectItem>
                <SelectItem value="28">28% (Ultra Luxury / Casino Slabs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 sm:col-span-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-xs font-medium text-foreground">Registered GST Entity</p>
                <p className="text-[11px] text-muted-foreground">
                  Generate official B2B GST tax invoices with CGST/SGST/IGST breakdown.
                </p>
              </div>
              <input
                type="checkbox"
                checked={property.isGstRegistered}
                onChange={(e) => updateProperty({ isGstRegistered: e.target.checked })}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-xs font-medium text-foreground">Room Rates Displayed Tax-Inclusive</p>
                <p className="text-[11px] text-muted-foreground">
                  Published guest tariffs on booking engine already include applicable hospitality taxes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={property.pricesTaxInclusive}
                onChange={(e) => updateProperty({ pricesTaxInclusive: e.target.checked })}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
