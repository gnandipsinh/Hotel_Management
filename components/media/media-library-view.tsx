"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Building2Icon,
  GitBranchIcon,
  ImagePlusIcon,
  Loader2Icon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { DataState, type DataStateKind } from "@/components/states/data-state";
import { ErrorState } from "@/components/states/error-state";
import type { FileCategory } from "@/lib/storage/file-categories";
import {
  createDemoBranch,
  createDemoHotel,
  deleteFileAsset,
  fetchBranchOptions,
  fetchHotelOptions,
  listFileAssets,
  patchFileAsset,
} from "@/lib/media/api";
import type { BranchOption, FileAssetDto, HotelOption } from "@/types/media";
import { ImageUpload } from "@/components/media/image-upload";
import { MultipleImageUpload } from "@/components/media/multiple-image-upload";
import { MediaGallery } from "@/components/media/media-gallery";
import { FileList } from "@/components/media/file-list";

/** Per-category cache entry, stamped with the tenant it was loaded for. */
interface CategoryEntry {
  hotelId: string;
  items: FileAssetDto[];
  error: boolean;
}

const DOCUMENT_CATEGORIES: { value: FileCategory; label: string }[] = [
  { value: "hotel_document", label: "Hotel documents" },
  { value: "guest_document", label: "Guest documents" },
  { value: "payment_proof", label: "Payment proofs" },
];

const LOGO_OPTS = { sort: "-createdAt", limit: 5 } as const;
const GALLERY_OPTS = { sort: "sortOrder" } as const;
const DOCS_OPTS = { sort: "-createdAt" } as const;

function randomObjectId(): string {
  const bytes = new Uint8Array(12);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Phase 7 media library: hotel selector + five tabs
 * (Branding / Gallery / Room & Restaurant / UPI QR / Documents).
 * All operations run against the `/api/files` endpoints.
 */
export function MediaLibraryView() {
  const [hotels, setHotels] = React.useState<HotelOption[]>([]);
  const [hotelsLoading, setHotelsLoading] = React.useState(true);
  const [hotelsError, setHotelsError] = React.useState(false);
  const [hotelId, setHotelId] = React.useState<string | null>(null);

  const [branchesState, setBranchesState] = React.useState<{
    hotelId: string;
    list: BranchOption[];
  } | null>(null);
  const [branchSel, setBranchSel] = React.useState<{
    hotelId: string;
    id: string;
  } | null>(null);

  const [tab, setTab] = React.useState("branding");
  const [docCategory, setDocCategory] = React.useState<FileCategory>("hotel_document");
  const [roomId, setRoomId] = React.useState<string>(() => randomObjectId());

  const [catStates, setCatStates] = React.useState<Record<string, CategoryEntry>>({});
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState<"hotel" | "branch" | null>(null);

  // ------------------------------------------------------------- hotels
  // All setState calls live inside promise callbacks so the effect below is
  // free of synchronous updates (react-hooks/set-state-in-effect).
  const loadHotels = React.useCallback(() => {
    return fetchHotelOptions()
      .then((list) => {
        setHotels(list);
        setHotelsError(false);
        setHotelId((current) => current ?? (list.length > 0 ? list[0].id : null));
      })
      .catch((error) => {
        setHotelsError(true);
        toast.error(errorMessage(error, "Could not load hotels"));
      })
      .finally(() => {
        setHotelsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    void loadHotels();
  }, [loadHotels]);

  const retryHotels = React.useCallback(() => {
    setHotelsLoading(true);
    setHotelsError(false);
    void loadHotels();
  }, [loadHotels]);

  const handleCreateHotel = async () => {
    setCreating("hotel");
    try {
      const hotel = await createDemoHotel();
      setHotels((current) => [...current, hotel]);
      setHotelId(hotel.id);
      toast.success(`Created "${hotel.name}"`);
    } catch (error) {
      toast.error(errorMessage(error, "Could not create the hotel"));
    } finally {
      setCreating(null);
    }
  };

  // ----------------------------------------------------------- branches
  React.useEffect(() => {
    if (!hotelId) return;
    let alive = true;
    fetchBranchOptions(hotelId)
      .then((list) => {
        if (alive) setBranchesState({ hotelId, list });
      })
      .catch((error) => {
        toast.error(errorMessage(error, "Could not load branches"));
      });
    return () => {
      alive = false;
    };
  }, [hotelId]);

  const branches =
    branchesState && branchesState.hotelId === hotelId ? branchesState.list : [];
  const branchesLoading = Boolean(hotelId) && !branchesState;
  const branchId = branchSel && branchSel.hotelId === hotelId ? branchSel.id : null;
  const branchSelected = Boolean(branchId);

  const handleCreateBranch = async () => {
    if (!hotelId) return;
    setCreating("branch");
    try {
      const branch = await createDemoBranch(hotelId);
      setBranchesState((prev) => ({
        hotelId,
        list: [...(prev && prev.hotelId === hotelId ? prev.list : []), branch],
      }));
      setBranchSel({ hotelId, id: branch.id });
      toast.success(`Created "${branch.name}"`);
    } catch (error) {
      toast.error(errorMessage(error, "Could not create the branch"));
    } finally {
      setCreating(null);
    }
  };

  // ------------------------------------------------------ media loading
  // Same constraint as loadHotels: setState only inside promise callbacks.
  const loadCategory = React.useCallback(
    (category: FileCategory, options?: { sort?: string; limit?: number }) => {
      if (!hotelId) return Promise.resolve();
      return listFileAssets({
        hotelId,
        category,
        limit: options?.limit ?? 60,
        sort: options?.sort,
      })
        .then(({ items }) => {
          setCatStates((prev) => ({ ...prev, [category]: { hotelId, items, error: false } }));
        })
        .catch((error) => {
          setCatStates((prev) => ({ ...prev, [category]: { hotelId, items: [], error: true } }));
          toast.error(errorMessage(error, `Could not load ${category.replace(/_/g, " ")}`));
        });
    },
    [hotelId],
  );

  const loadBaseMedia = React.useCallback(() => {
    void loadCategory("hotel_logo", LOGO_OPTS);
    void loadCategory("hotel_cover", LOGO_OPTS);
    void loadCategory("hotel_gallery", GALLERY_OPTS);
    void loadCategory("upi_qr", LOGO_OPTS);
    void loadCategory("room_image", GALLERY_OPTS);
    void loadCategory("restaurant_image", GALLERY_OPTS);
  }, [loadCategory]);

  // Load every category whenever the tenant (or document tab) changes.
  React.useEffect(() => {
    loadBaseMedia();
  }, [loadBaseMedia]);

  React.useEffect(() => {
    void loadCategory(docCategory, DOCS_OPTS);
  }, [docCategory, loadCategory]);

  const itemsOf = React.useCallback(
    (category: string): FileAssetDto[] | undefined => {
      const entry = catStates[category];
      return entry && hotelId && entry.hotelId === hotelId ? entry.items : undefined;
    },
    [catStates, hotelId],
  );

  const stateOf = React.useCallback(
    (category: string): DataStateKind => {
      const entry = catStates[category];
      if (!entry || entry.hotelId !== hotelId) return "loading";
      return entry.error ? "error" : "success";
    },
    [catStates, hotelId],
  );

  const errorOf = React.useCallback(
    (category: string): boolean => stateOf(category) === "error",
    [stateOf],
  );

  // ---------------------------------------------------------- mutations
  const removeAsset = async (asset: FileAssetDto, after: () => Promise<void> | void) => {
    if (!hotelId) return;
    setBusyId(asset.id);
    try {
      await deleteFileAsset(asset.id, hotelId);
      toast.success("File deleted");
      await after();
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete the file"));
    } finally {
      setBusyId(null);
    }
  };

  const handleSetPrimary = async (asset: FileAssetDto) => {
    if (!hotelId) return;
    setBusyId(asset.id);
    try {
      await patchFileAsset(asset.id, hotelId, { isPrimary: true });
      toast.success("Primary image updated");
      await loadCategory("hotel_gallery", GALLERY_OPTS);
    } catch (error) {
      toast.error(errorMessage(error, "Could not set the primary image"));
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (asset: FileAssetDto, direction: -1 | 1) => {
    if (!hotelId) return;
    const list = itemsOf("hotel_gallery") ?? [];
    const index = list.findIndex((entry) => entry.id === asset.id);
    const neighbor = list[index + direction];
    if (index < 0 || !neighbor) return;
    setBusyId(asset.id);
    try {
      await Promise.all([
        patchFileAsset(asset.id, hotelId, { sortOrder: neighbor.sortOrder }),
        patchFileAsset(neighbor.id, hotelId, { sortOrder: asset.sortOrder }),
      ]);
      await loadCategory("hotel_gallery", GALLERY_OPTS);
    } catch (error) {
      toast.error(errorMessage(error, "Could not reorder the gallery"));
    } finally {
      setBusyId(null);
    }
  };

  // ----------------------------------------------------------- derived
  const logo = itemsOf("hotel_logo")?.[0] ?? null;
  const cover = itemsOf("hotel_cover")?.[0] ?? null;
  const upiQr = itemsOf("upi_qr")?.[0] ?? null;
  const gallery = itemsOf("hotel_gallery") ?? [];
  const docs = itemsOf(docCategory) ?? [];
  const roomImages = (itemsOf("room_image") ?? []).filter(
    (asset) => !branchId || asset.branchId === branchId,
  );
  const restaurantImages = (itemsOf("restaurant_image") ?? []).filter(
    (asset) => !branchId || asset.branchId === branchId,
  );

  const hotelsState: DataStateKind = hotelsLoading
    ? "loading"
    : hotelsError
      ? "error"
      : hotels.length === 0
        ? "empty"
        : "success";

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Media Library"
        description="Upload and organise logos, gallery images, room media, UPI QR codes and documents for the selected hotel."
        actions={
          <>
            <Select
              value={hotelId ?? ""}
              onValueChange={(value) => setHotelId(value)}
              disabled={hotelsLoading || hotels.length === 0}
            >
              <SelectTrigger className="w-[200px] sm:w-[240px]" aria-label="Select hotel">
                <SelectValue
                  placeholder={hotelsLoading ? "Loading hotels…" : "Select hotel"}
                />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => {
                if (hotelId) {
                  loadBaseMedia();
                  void loadCategory(docCategory, DOCS_OPTS);
                } else {
                  retryHotels();
                }
              }}
              aria-label="Refresh media"
            >
              <RefreshCwIcon />
            </Button>
          </>
        }
      />

      <div className="mt-5">
        <DataState
          state={hotelsState}
          skeleton="rows"
          skeletonRows={4}
          onRetry={retryHotels}
          error={{
            title: "Could not load hotels",
            description: "The hotel list is required to open the media library.",
            onRetry: retryHotels,
          }}
          empty={{
            icon: Building2Icon,
            title: "No hotels yet",
            description:
              "Create a hotel first — every file is stored inside a tenant folder.",
            action: {
              label: creating === "hotel" ? "Creating…" : "Create demo hotel",
              onClick: handleCreateHotel,
            },
          }}
        >
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="rooms">Room &amp; Restaurant</TabsTrigger>
              <TabsTrigger value="upi">UPI QR</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* ---------------------------------------------------- Branding */}
            <TabsContent value="branding" className="mt-4 flex flex-col gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Hotel logo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      hotelId={hotelId!}
                      category="hotel_logo"
                      label="Upload logo"
                      description="Shown on invoices, the website header and the sidebar."
                      asset={logo}
                      loading={stateOf("hotel_logo") === "loading"}
                      onChanged={() => void loadCategory("hotel_logo", LOGO_OPTS)}
                    />
                    {errorOf("hotel_logo") && (
                      <ErrorState
                        className="mt-3 py-8"
                        description="The logo could not be loaded."
                        onRetry={() => void loadCategory("hotel_logo", LOGO_OPTS)}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Cover image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      hotelId={hotelId!}
                      category="hotel_cover"
                      label="Upload cover"
                      description="Wide banner shown at the top of the hotel website."
                      aspect="wide"
                      asset={cover}
                      loading={stateOf("hotel_cover") === "loading"}
                      onChanged={() => void loadCategory("hotel_cover", LOGO_OPTS)}
                    />
                    {errorOf("hotel_cover") && (
                      <ErrorState
                        className="mt-3 py-8"
                        description="The cover image could not be loaded."
                        onRetry={() => void loadCategory("hotel_cover", LOGO_OPTS)}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ----------------------------------------------------- Gallery */}
            <TabsContent value="gallery" className="mt-4 flex flex-col gap-4">
              <Card>
                <CardHeader className="flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <ImagePlusIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                    Hotel gallery
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {gallery.length} image{gallery.length === 1 ? "" : "s"}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <MultipleImageUpload
                    hotelId={hotelId!}
                    category="hotel_gallery"
                    label="Drag & drop gallery images"
                    onUploaded={() => void loadCategory("hotel_gallery", GALLERY_OPTS)}
                  />
                  <MediaGallery
                    assets={gallery}
                    loading={stateOf("hotel_gallery") === "loading"}
                    busyId={busyId}
                    onSetPrimary={handleSetPrimary}
                    onMove={handleMove}
                    onDelete={(asset) =>
                      void removeAsset(asset, () =>
                        loadCategory("hotel_gallery", GALLERY_OPTS),
                      )
                    }
                    emptyTitle="No gallery images yet"
                    emptyDescription="Upload photos of the property to populate the gallery."
                  />
                  {errorOf("hotel_gallery") && (
                    <ErrorState
                      description="The gallery could not be loaded."
                      onRetry={() => void loadCategory("hotel_gallery", GALLERY_OPTS)}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------------------------------------------ Room & Restaurant */}
            <TabsContent value="rooms" className="mt-4 flex flex-col gap-4">
              <Card>
                <CardHeader className="flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <GitBranchIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                    Branch
                  </CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCreateBranch}
                    disabled={!hotelId || creating === "branch"}
                  >
                    {creating === "branch" ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <PlusIcon />
                    )}
                    Create demo branch
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {branchesLoading ? (
                    <Skeleton className="h-8 w-[240px]" />
                  ) : branches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No branches yet. Room and restaurant images need a branch — create
                      one to continue.
                    </p>
                  ) : (
                    <Select
                      value={branchId ?? ""}
                      onValueChange={(value) => setBranchSel({ hotelId: hotelId!, id: value })}
                    >
                      <SelectTrigger
                        className="w-full sm:w-[280px]"
                        aria-label="Select branch"
                      >
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name} ({branch.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Room images</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <label className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Room ID
                      </span>
                      <Input
                        value={roomId}
                        onChange={(event) => setRoomId(event.target.value)}
                        placeholder="24-character room id"
                        disabled={!branchSelected}
                        className="font-mono text-xs"
                      />
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRoomId(randomObjectId())}
                      disabled={!branchSelected}
                    >
                      Generate new ID
                    </Button>
                  </div>
                  <MultipleImageUpload
                    hotelId={hotelId!}
                    category="room_image"
                    branchId={branchId ?? undefined}
                    entityId={roomId}
                    disabled={!branchSelected}
                    label="Upload room images"
                    description="Room CRUD arrives in a later phase — use any valid room ID."
                    onUploaded={() => void loadCategory("room_image", GALLERY_OPTS)}
                  />
                  <MediaGallery
                    assets={roomImages}
                    loading={stateOf("room_image") === "loading"}
                    busyId={busyId}
                    onDelete={(asset) =>
                      void removeAsset(asset, () =>
                        loadCategory("room_image", GALLERY_OPTS),
                      )
                    }
                    emptyTitle={branchSelected ? "No room images yet" : "Select a branch"}
                    emptyDescription={
                      branchSelected
                        ? "Upload photos for rooms in this branch."
                        : "Choose a branch above to see and upload room images."
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Restaurant images</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <MultipleImageUpload
                    hotelId={hotelId!}
                    category="restaurant_image"
                    branchId={branchId ?? undefined}
                    disabled={!branchSelected}
                    label="Upload restaurant images"
                    onUploaded={() =>
                      void loadCategory("restaurant_image", GALLERY_OPTS)
                    }
                  />
                  <MediaGallery
                    assets={restaurantImages}
                    loading={stateOf("restaurant_image") === "loading"}
                    busyId={busyId}
                    onDelete={(asset) =>
                      void removeAsset(asset, () =>
                        loadCategory("restaurant_image", GALLERY_OPTS),
                      )
                    }
                    emptyTitle={branchSelected ? "No restaurant images yet" : "Select a branch"}
                    emptyDescription={
                      branchSelected
                        ? "Upload photos of the restaurant for this branch."
                        : "Choose a branch above to see and upload restaurant images."
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ------------------------------------------------------- UPI QR */}
            <TabsContent value="upi" className="mt-4 flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">UPI QR code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="w-full sm:w-[260px]">
                      <ImageUpload
                        hotelId={hotelId!}
                        category="upi_qr"
                        label="Upload UPI QR"
                        description="Square QR image shown at reception and on invoices."
                        asset={upiQr}
                        loading={stateOf("upi_qr") === "loading"}
                        onChanged={() => void loadCategory("upi_qr", LOGO_OPTS)}
                      />
                    </div>
                    {upiQr && (
                      <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                        <p className="font-medium">{upiQr.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {upiQr.mimeType} · {upiQr.width ?? "?"}×{upiQr.height ?? "?"} px
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Payments made to this QR are matched during reconciliation.
                        </p>
                      </div>
                    )}
                  </div>
                  {errorOf("upi_qr") && (
                    <ErrorState
                      className="mt-3 py-8"
                      description="The QR code could not be loaded."
                      onRetry={() => void loadCategory("upi_qr", LOGO_OPTS)}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* --------------------------------------------------- Documents */}
            <TabsContent value="documents" className="mt-4 flex flex-col gap-4">
              <Card>
                <CardHeader className="flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-sm font-semibold">Documents</CardTitle>
                  <Select
                    value={docCategory}
                    onValueChange={(value) => setDocCategory(value as FileCategory)}
                  >
                    <SelectTrigger className="w-[200px]" aria-label="Document type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map((entry) => (
                        <SelectItem key={entry.value} value={entry.value}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <MultipleImageUpload
                    hotelId={hotelId!}
                    category={docCategory}
                    label="Drag & drop documents"
                    description="Private files — access is gated per file."
                    onUploaded={() => void loadCategory(docCategory, DOCS_OPTS)}
                  />
                  <FileList
                    assets={docs}
                    loading={stateOf(docCategory) === "loading"}
                    busyId={busyId}
                    onDelete={(asset) =>
                      void removeAsset(asset, () => loadCategory(docCategory, DOCS_OPTS))
                    }
                  />
                  {errorOf(docCategory) && (
                    <ErrorState
                      description="The documents could not be loaded."
                      onRetry={() => void loadCategory(docCategory, DOCS_OPTS)}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DataState>
      </div>
    </PageContainer>
  );
}
