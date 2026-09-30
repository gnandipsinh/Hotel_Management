"use client";

import * as React from "react";
import {
  QrCodeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
  UploadCloudIcon,
  WalletIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";
import type { FileAssetDto } from "@/types/media";

interface Step6Props {
  onboarding: UseOnboardingReturn;
}

export function Step6PaymentUpi({ onboarding }: Step6Props) {
  const { state, errors, updatePayment } = onboarding;
  const { payment, hotel } = state;

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleQrUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${file.name}-${file.size}`;
    const asset: FileAssetDto = {
      id: `upi-qr-${id}`,
      hotelId: "hotel-onboarding",
      originalName: file.name,
      storageProvider: "local",
      url: objectUrl,
      secureUrl: objectUrl,
      mimeType: file.type || "image/png",
      extension: file.name.split(".").pop() || "png",
      size: file.size,
      category: "upi_qr",
      status: "active",
      access: "public",
      sortOrder: 0,
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updatePayment({ upiQr: asset });
    toast.success("UPI QR code uploaded successfully");
  };

  const handleUseHotelNameAsPayee = () => {
    if (hotel.legalName || hotel.name) {
      updatePayment({ displayName: hotel.legalName || hotel.name });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <QrCodeIcon className="size-4" aria-hidden="true" />
          <span>Step 6 · Direct Settlement & QR</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Payment & UPI Direct Settlement
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure direct guest QR payments. Funds settle immediately into your hotel account with zero intermediary commission.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleQrUpload(e.target.files[0]);
        }}
      />

      {/* Main UPI Configuration */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">UPI Handle & Payee Details</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Used on digital room service menus, reception folio bills, and SMS payment links.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* UPI ID */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="upi-vpa" className="text-xs font-medium">
              Primary Hotel UPI ID (VPA)
            </Label>
            <div className="relative">
              <WalletIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="upi-vpa"
                placeholder="e.g. royalmirage@okhdfcbank"
                value={payment.upiId}
                onChange={(e) => updatePayment({ upiId: e.target.value.toLowerCase().trim() })}
                className={`pl-9 lowercase ${errors.upiId ? "border-destructive" : ""}`}
              />
            </div>
            {errors.upiId ? (
              <p className="text-xs font-medium text-destructive">{errors.upiId}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Supported handles: @okhdfcbank, @okaxis, @oksbi, @icici, @paytm, etc.
              </p>
            )}
          </div>

          {/* Payee Display Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="payee-name" className="text-xs font-medium">
                Merchant / Payee Name Shown on UPI Apps
              </Label>
              <button
                type="button"
                onClick={handleUseHotelNameAsPayee}
                className="text-[11px] text-primary hover:underline focus:outline-hidden"
              >
                Use Legal Business Name
              </button>
            </div>
            <Input
              id="payee-name"
              placeholder="e.g. Mirage Hospitality Private Limited"
              value={payment.displayName}
              onChange={(e) => updatePayment({ displayName: e.target.value })}
            />
          </div>

          {/* Bank / Payment Instructions */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="payment-notes" className="text-xs font-medium">
              Guest Payment Instructions & Remarks
            </Label>
            <Textarea
              id="payment-notes"
              rows={3}
              placeholder="e.g. Kindly enter your Room Number or Reservation ID in the payment remarks for instant folio matching."
              value={payment.bankNotes ?? ""}
              onChange={(e) => updatePayment({ bankNotes: e.target.value })}
              className="resize-none text-xs"
            />
          </div>
        </div>
      </section>

      {/* QR Code Upload Card */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Official Standee / Dynamic QR Code</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Printed on front desk acrylic stands, in-room guest directories, and restaurant bills.
            </p>
          </div>
          {payment.upiQr && (
            <Badge variant="outline" className="text-xs">
              <ShieldCheckIcon className="mr-1 size-3 text-emerald-500" /> Standee QR Set
            </Badge>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-[180px_1fr]">
          {/* QR Preview Frame */}
          <div className="flex flex-col items-center">
            {payment.upiQr ? (
              <div className="group relative size-44 overflow-hidden rounded-2xl border-2 border-primary/20 bg-background p-2.5 shadow-sm">
                <div className="relative size-full overflow-hidden rounded-xl bg-white p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={payment.upiQr.url}
                    alt="UPI QR Code"
                    className="size-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      onClick={() => fileInputRef.current?.click()}
                      title="Replace QR"
                    >
                      <RefreshCwIcon className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-xs"
                      onClick={() => updatePayment({ upiQr: null })}
                      title="Remove QR"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files?.[0]) handleQrUpload(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex size-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-colors ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <QrCodeIcon className="size-8 text-muted-foreground" />
                <span className="mt-2 text-xs font-medium text-foreground">Upload UPI QR</span>
                <span className="text-[10px] text-muted-foreground">PNG or JPG</span>
              </div>
            )}
          </div>

          {/* Description & Action */}
          <div className="space-y-3">
            {payment.upiQr ? (
              <div className="space-y-2">
                <div className="text-xs">
                  <p className="font-medium text-foreground">{payment.upiQr.originalName}</p>
                  <p className="text-muted-foreground">
                    {(payment.upiQr.size / 1024).toFixed(0)} KB · Ready for front desk displays
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RefreshCwIcon className="size-3.5" />
                    Replace QR
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => updatePayment({ upiQr: null })}
                  >
                    <Trash2Icon className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Upload an image of your bank merchant UPI QR code. Your receptionists can display it directly from the tablet folio screen when checking out guests.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloudIcon className="size-3.5" />
                  Select QR Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Instant Settlement Badge Callout */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground dark:bg-primary/10">
        <SparklesIcon className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Direct Merchant Settlement:</strong> Unlike third-party aggregators that withhold funds for 48 hours, direct UPI payments settle immediately into your designated current account.
        </p>
      </div>
    </div>
  );
}
