"use client";

import * as React from "react";
import {
  CameraIcon,
  CheckCircle2Icon,
  ImageIcon,
  SparklesIcon,
  Trash2Icon,
  UploadCloudIcon,
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshCwIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";
import type { FileAssetDto } from "@/types/media";

interface Step2Props {
  onboarding: UseOnboardingReturn;
}

const LUXURY_PHOTO_PRESETS = [
  {
    name: "Lake Pichola Palace Facade",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80",
    category: "hotel_cover" as const,
  },
  {
    name: "Heritage Archways & Courtyard",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
    category: "hotel_gallery" as const,
  },
  {
    name: "Royal Maharaja Suite",
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80",
    category: "hotel_gallery" as const,
  },
  {
    name: "Infinity Pool overlooking Hills",
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80",
    category: "hotel_gallery" as const,
  },
  {
    name: "Fine Dining Chandeliers",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
    category: "hotel_gallery" as const,
  },
];

function createFileAssetFromLocal(file: File, category: FileAssetDto["category"]): Promise<FileAssetDto> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${file.name}-${file.size}`;
    const asset: FileAssetDto = {
      id: `local-${id}`,
      hotelId: "hotel-onboarding",
      originalName: file.name,
      storageProvider: "local",
      url: objectUrl,
      secureUrl: objectUrl,
      mimeType: file.type || "image/jpeg",
      extension: file.name.split(".").pop() || "jpg",
      size: file.size,
      category,
      status: "active",
      access: "public",
      sortOrder: 0,
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    resolve(asset);
  });
}

function generatePresetAsset(presetName: string, presetUrl: string, sortOrder: number): FileAssetDto {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `preset-${sortOrder}`;
  return {
    id: `preset-${id}`,
    hotelId: "hotel-onboarding",
    originalName: `${presetName}.jpg`,
    storageProvider: "local",
    url: presetUrl,
    mimeType: "image/jpeg",
    extension: "jpg",
    size: 512000,
    category: "hotel_gallery",
    status: "active",
    access: "public",
    sortOrder,
    isPrimary: sortOrder === 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

export function Step2HotelBranding({ onboarding }: Step2Props) {
  const {
    state,
    errors,
    updateBranding,
    addGalleryImage,
    removeGalleryImage,
    setPrimaryGalleryImage,
    reorderGalleryImage,
  } = onboarding;
  const { branding } = state;

  const logoInputRef = React.useRef<HTMLInputElement | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement | null>(null);
  const galleryInputRef = React.useRef<HTMLInputElement | null>(null);

  const [isDragOverLogo, setIsDragOverLogo] = React.useState(false);
  const [isDragOverCover, setIsDragOverCover] = React.useState(false);
  const [isDragOverGallery, setIsDragOverGallery] = React.useState(false);

  // Logo handlers
  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }
    const asset = await createFileAssetFromLocal(file, "hotel_logo");
    updateBranding({ logo: asset });
    toast.success("Hotel logo updated");
  };

  // Cover handlers
  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }
    const asset = await createFileAssetFromLocal(file, "hotel_cover");
    updateBranding({ cover: asset });
    toast.success("Hotel cover image updated");
  };

  // Gallery handlers
  const handleGalleryUpload = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    for (const f of validFiles) {
      const asset = await createFileAssetFromLocal(f, "hotel_gallery");
      asset.isPrimary = branding.gallery.length === 0;
      asset.sortOrder = branding.gallery.length + 1;
      addGalleryImage(asset);
    }
    toast.success(`Added ${validFiles.length} photo(s) to property gallery`);
  };

  const handleApplyPreset = (preset: (typeof LUXURY_PHOTO_PRESETS)[0]) => {
    const asset = generatePresetAsset(
      preset.name,
      preset.url,
      branding.gallery.length + 1,
    );
    addGalleryImage(asset);
    toast.success(`Added "${preset.name}" to gallery`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <CameraIcon className="size-4" aria-hidden="true" />
          <span>Step 2 · Visual Identity & Media</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Hotel Branding & Showcase
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your hotel crest, high-resolution hero banner, and property gallery showcasing your rooms and amenities.
        </p>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
        }}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleGalleryUpload(e.target.files);
          }
        }}
      />

      {/* Hotel Logo Section */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Hotel Crest / Logo <span className="text-destructive">*</span>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Displayed on invoices, guest folios, keycard slips, and the staff console. Recommended: 512×512 PNG or SVG.
            </p>
          </div>
          {branding.logo && (
            <Badge variant="outline" className="text-xs">
              <CheckCircle2Icon className="mr-1 size-3 text-emerald-500" /> Uploaded
            </Badge>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 items-center gap-6 sm:grid-cols-[160px_1fr]">
          {/* Logo Preview */}
          <div className="flex flex-col items-center">
            {branding.logo ? (
              <div className="relative group size-36 overflow-hidden rounded-2xl border bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={branding.logo.url}
                  alt="Hotel Logo"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-xs"
                    onClick={() => logoInputRef.current?.click()}
                    title="Replace Logo"
                  >
                    <RefreshCwIcon className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-xs"
                    onClick={() => updateBranding({ logo: null })}
                    title="Remove Logo"
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverLogo(true);
                }}
                onDragLeave={() => setIsDragOverLogo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOverLogo(false);
                  if (e.dataTransfer.files?.[0]) handleLogoUpload(e.dataTransfer.files[0]);
                }}
                onClick={() => logoInputRef.current?.click()}
                className={`flex size-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-colors ${
                  isDragOverLogo
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <UploadCloudIcon className="size-6 text-muted-foreground" />
                <span className="mt-2 text-xs font-medium text-foreground">Upload Crest</span>
                <span className="text-[10px] text-muted-foreground">Drop file here</span>
              </div>
            )}
          </div>

          {/* Logo Actions / Info */}
          <div className="space-y-3">
            {branding.logo ? (
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="font-medium text-foreground">{branding.logo.originalName}</span>
                  <p className="text-muted-foreground">
                    {(branding.logo.size / 1024).toFixed(0)} KB · {branding.logo.mimeType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <RefreshCwIcon className="size-3.5" />
                    Replace Crest
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => updateBranding({ logo: null })}
                  >
                    <Trash2Icon className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  No logo uploaded yet. You can drag and drop a file or click to choose from your computer.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <UploadCloudIcon className="size-3.5" />
                  Select File
                </Button>
              </div>
            )}
            {errors.logo && (
              <p className="text-xs font-medium text-destructive">{errors.logo}</p>
            )}
          </div>
        </div>
      </section>

      {/* Hotel Cover Image Section */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hotel Showcase Banner (Cover)</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              High-resolution panoramic photo displayed on your booking portal and property splash screen.
            </p>
          </div>
          {branding.cover && (
            <Badge variant="outline" className="text-xs">
              <CheckCircle2Icon className="mr-1 size-3 text-emerald-500" /> Cover Active
            </Badge>
          )}
        </div>

        <div className="mt-5">
          {branding.cover ? (
            <div className="group relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={branding.cover.url}
                alt="Hotel Cover"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute right-3 bottom-3 left-3 sm:right-4 sm:bottom-4 sm:left-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{branding.cover.originalName}</p>
                  <p className="text-[11px] opacity-75">
                    {(branding.cover.size / 1024).toFixed(0)} KB · Showcase Display
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 bg-background/80 text-foreground backdrop-blur-xs hover:bg-background"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <RefreshCwIcon className="size-3.5" />
                    Replace Banner
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-8"
                    onClick={() => updateBranding({ cover: null })}
                  >
                    <Trash2Icon className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverCover(true);
              }}
              onDragLeave={() => setIsDragOverCover(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOverCover(false);
                if (e.dataTransfer.files?.[0]) handleCoverUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => coverInputRef.current?.click()}
              className={`flex aspect-[21/9] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                isDragOverCover
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              <ImageIcon className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">Upload Cover Banner</p>
              <p className="text-xs text-muted-foreground">Drag & drop 16:9 banner or click to browse</p>
              <Button type="button" size="sm" variant="outline" className="mt-3">
                Browse Files
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Property Showcase Gallery */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Property Photo Gallery</h3>
              <Badge variant="secondary" className="text-xs">
                {branding.gallery.length} Photos
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Guest rooms, courtyards, dining, wellness facilities and architectural features.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => galleryInputRef.current?.click()}
            >
              <UploadCloudIcon className="size-3.5" />
              Upload Photos
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-5">
          {branding.gallery.length === 0 ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverGallery(true);
              }}
              onDragLeave={() => setIsDragOverGallery(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOverGallery(false);
                if (e.dataTransfer.files) handleGalleryUpload(e.dataTransfer.files);
              }}
              onClick={() => galleryInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                isDragOverGallery
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              <CameraIcon className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">Add hotel photos</p>
              <p className="text-xs text-muted-foreground">
                Drop your hotel photos here to start building your luxury showcase
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {branding.gallery.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border bg-muted/40 shadow-2xs"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.originalName}
                      className="size-full object-cover transition-transform group-hover:scale-102"
                    />
                    {photo.isPrimary && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-xs">
                        <StarIcon className="size-3 fill-current" /> Primary
                      </span>
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!photo.isPrimary && (
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="secondary"
                          className="size-7 bg-background/80 shadow-xs backdrop-blur-xs hover:bg-background"
                          onClick={() => setPrimaryGalleryImage(photo.id)}
                          title="Make Primary Showcase Photo"
                        >
                          <StarIcon className="size-3.5" />
                        </Button>
                      )}
                      {idx > 0 && (
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="secondary"
                          className="size-7 bg-background/80 shadow-xs backdrop-blur-xs hover:bg-background"
                          onClick={() => reorderGalleryImage(photo.id, -1)}
                          title="Move Earlier"
                        >
                          <ArrowLeftIcon className="size-3.5" />
                        </Button>
                      )}
                      {idx < branding.gallery.length - 1 && (
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="secondary"
                          className="size-7 bg-background/80 shadow-xs backdrop-blur-xs hover:bg-background"
                          onClick={() => reorderGalleryImage(photo.id, 1)}
                          title="Move Later"
                        >
                          <ArrowRightIcon className="size-3.5" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="destructive"
                        className="size-7 shadow-xs"
                        onClick={() => removeGalleryImage(photo.id)}
                        title="Delete Photo"
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 text-[11px] text-muted-foreground">
                    <span className="truncate font-medium text-foreground">{photo.originalName}</span>
                    <span>{(photo.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick luxury preset samples */}
        <div className="mt-6 border-t pt-4">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <SparklesIcon className="size-3.5 text-primary" />
            Instant Demo Presets — add high-res royalty-free photos with one click:
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {LUXURY_PHOTO_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleApplyPreset(preset)}
              >
                + {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
