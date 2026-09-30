"use client";

import * as React from "react";
import {
  Building2Icon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ReceiptIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HOTEL_TYPE_OPTIONS,
  STAR_RATING_OPTIONS,
} from "@/config/onboarding";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";
import type { HotelType, StarRating } from "@/types/onboarding";

interface Step1Props {
  onboarding: UseOnboardingReturn;
}

export function Step1HotelInfo({ onboarding }: Step1Props) {
  const { state, errors, updateHotel } = onboarding;
  const { hotel } = state;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <Building2Icon className="size-4" aria-hidden="true" />
          <span>Step 1 · Identity & Credentials</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Hotel Information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the registered business identity, property classification, and primary guest contact details.
        </p>
      </div>

      {/* Property Identity Card */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Property Classification</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          How your establishment is marketed to guests and registered in official directories.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Hotel Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hotel-name" className="text-xs font-medium">
              Hotel Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hotel-name"
              placeholder="e.g. The Royal Mirage Palace & Spa"
              value={hotel.name}
              onChange={(e) => updateHotel({ name: e.target.value })}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs font-medium text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Legal Business Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="legal-name" className="text-xs font-medium">
              Legal / Registered Business Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legal-name"
              placeholder="e.g. Mirage Hospitality Private Limited"
              value={hotel.legalName}
              onChange={(e) => updateHotel({ legalName: e.target.value })}
              className={errors.legalName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.legalName && (
              <p className="text-xs font-medium text-destructive">{errors.legalName}</p>
            )}
          </div>

          {/* Hotel Type */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-type" className="text-xs font-medium">
              Property Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={hotel.type}
              onValueChange={(val) => updateHotel({ type: val as HotelType })}
            >
              <SelectTrigger
                id="hotel-type"
                className={errors.type ? "border-destructive focus:ring-destructive" : ""}
              >
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {HOTEL_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs font-medium text-destructive">{errors.type}</p>
            )}
          </div>

          {/* Star / Category Rating */}
          <div className="space-y-1.5">
            <Label htmlFor="star-rating" className="text-xs font-medium">
              Star / Category Rating <span className="text-destructive">*</span>
            </Label>
            <Select
              value={hotel.starRating}
              onValueChange={(val) => updateHotel({ starRating: val as StarRating })}
            >
              <SelectTrigger
                id="star-rating"
                className={errors.starRating ? "border-destructive focus:ring-destructive" : ""}
              >
                <SelectValue placeholder="Select star category" />
              </SelectTrigger>
              <SelectContent>
                {STAR_RATING_OPTIONS.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.starRating && (
              <p className="text-xs font-medium text-destructive">{errors.starRating}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Details Card */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Contact & Communication</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Primary communication channels for guest bookings and administrative notifications.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-email" className="text-xs font-medium">
              Primary Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MailIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="hotel-email"
                type="email"
                placeholder="reservations@hotel.com"
                value={hotel.email}
                onChange={(e) => updateHotel({ email: e.target.value })}
                className={`pl-9 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Primary Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-phone" className="text-xs font-medium">
              Primary Phone <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="hotel-phone"
                placeholder="+91 98765 43210"
                value={hotel.phone}
                onChange={(e) => updateHotel({ phone: e.target.value })}
                className={`pl-9 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs font-medium text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Alternate Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-alt-phone" className="text-xs font-medium text-muted-foreground">
              Alternate / Duty Manager Phone (Optional)
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="hotel-alt-phone"
                placeholder="+91 98765 43211"
                value={hotel.alternatePhone ?? ""}
                onChange={(e) => updateHotel({ alternatePhone: e.target.value })}
                className={`pl-9 ${errors.alternatePhone ? "border-destructive" : ""}`}
              />
            </div>
            {errors.alternatePhone && (
              <p className="text-xs font-medium text-destructive">{errors.alternatePhone}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-website" className="text-xs font-medium text-muted-foreground">
              Official Website (Optional)
            </Label>
            <div className="relative">
              <GlobeIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="hotel-website"
                placeholder="https://royalmirage.com"
                value={hotel.website ?? ""}
                onChange={(e) => updateHotel({ website: e.target.value })}
                className={`pl-9 ${errors.website ? "border-destructive" : ""}`}
              />
            </div>
            {errors.website && (
              <p className="text-xs font-medium text-destructive">{errors.website}</p>
            )}
          </div>
        </div>
      </section>

      {/* Address & Legal Card */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">Location & Tax Compliance</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Physical property address and tax registration credentials for guest folio generation.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Street Address */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hotel-address" className="text-xs font-medium">
              Property Street Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPinIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="hotel-address"
                placeholder="Palace Road, Near Lake Pichola"
                value={hotel.address}
                onChange={(e) => updateHotel({ address: e.target.value })}
                className={`pl-9 ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {errors.address && (
              <p className="text-xs font-medium text-destructive">{errors.address}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-city" className="text-xs font-medium">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hotel-city"
              placeholder="Udaipur"
              value={hotel.city}
              onChange={(e) => updateHotel({ city: e.target.value })}
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="text-xs font-medium text-destructive">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-state" className="text-xs font-medium">
              State / Province <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hotel-state"
              placeholder="Rajasthan"
              value={hotel.state}
              onChange={(e) => updateHotel({ state: e.target.value })}
              className={errors.state ? "border-destructive" : ""}
            />
            {errors.state && (
              <p className="text-xs font-medium text-destructive">{errors.state}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-country" className="text-xs font-medium">
              Country <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hotel-country"
              placeholder="India"
              value={hotel.country}
              onChange={(e) => updateHotel({ country: e.target.value })}
              className={errors.country ? "border-destructive" : ""}
            />
            {errors.country && (
              <p className="text-xs font-medium text-destructive">{errors.country}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-1.5">
            <Label htmlFor="hotel-postal" className="text-xs font-medium">
              Postal Code / PIN <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hotel-postal"
              placeholder="313001"
              value={hotel.postalCode}
              onChange={(e) => updateHotel({ postalCode: e.target.value })}
              className={errors.postalCode ? "border-destructive" : ""}
            />
            {errors.postalCode && (
              <p className="text-xs font-medium text-destructive">{errors.postalCode}</p>
            )}
          </div>

          {/* GSTIN Number */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hotel-gstin" className="text-xs font-medium text-muted-foreground">
                GSTIN / Tax Identification Number (Optional)
              </Label>
              <span className="text-[11px] text-muted-foreground">15 Alphanumeric characters</span>
            </div>
            <div className="relative">
              <ReceiptIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="hotel-gstin"
                placeholder="08AAAAA0000A1Z5"
                value={hotel.gstNumber ?? ""}
                onChange={(e) => updateHotel({ gstNumber: e.target.value.toUpperCase() })}
                className={`pl-9 uppercase ${errors.gstNumber ? "border-destructive" : ""}`}
              />
            </div>
            {errors.gstNumber && (
              <p className="text-xs font-medium text-destructive">{errors.gstNumber}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
