"use client";

import { Building2Icon, CheckIcon, ChevronDownIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useShell } from "@/components/layout/shell-context";

/**
 * Hotel → Branch context switcher UI.
 * Today it switches mock context; later it switches the real tenant session scope.
 */
export function HotelBranchSwitcher() {
  const { hotel, hotels, branch, branches, setHotelId, setBranchId } = useShell();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" aria-label="Switch hotel or branch">
          <Building2Icon aria-hidden="true" />
          <span className="max-w-28 truncate lg:max-w-40">{hotel.name}</span>
          <span aria-hidden="true" className="text-muted-foreground/60">
            /
          </span>
          <span className="max-w-24 truncate text-muted-foreground lg:max-w-32">
            {branch?.name}
          </span>
          <ChevronDownIcon aria-hidden="true" className="size-3.5 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-3">
        <p className="mb-1 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Hotels
        </p>
        <ul className="flex flex-col gap-0.5">
          {hotels.map((hotelOption) => (
            <li key={hotelOption.id}>
              <button
                type="button"
                onClick={() => setHotelId(hotelOption.id)}
                aria-pressed={hotelOption.id === hotel.id}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors",
                  "hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  hotelOption.id === hotel.id && "bg-muted font-medium",
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Building2Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{hotelOption.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {hotelOption.city}, {hotelOption.state} · {hotelOption.branchesCount}{" "}
                    {hotelOption.branchesCount === 1 ? "branch" : "branches"}
                  </span>
                </span>
                {hotelOption.id === hotel.id && (
                  <CheckIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <Separator className="my-3" />

        <p className="mb-1 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Branches
        </p>
        <ul className="flex flex-col gap-0.5">
          {branches.map((branchOption) => (
            <li key={branchOption.id}>
              <button
                type="button"
                onClick={() => setBranchId(branchOption.id)}
                aria-pressed={branchOption.id === branch?.id}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors",
                  "hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  branchOption.id === branch?.id && "bg-muted font-medium",
                )}
              >
                <MapPinIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{branchOption.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {branchOption.roomsCount} rooms · {branchOption.code}
                  </span>
                </span>
                {branchOption.id === branch?.id && (
                  <CheckIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-3 border-t pt-2.5 text-[0.6875rem] leading-relaxed text-muted-foreground">
          Demo context — real hotel/branch scope comes from the authenticated backend
          session in a later phase.
        </p>
      </PopoverContent>
    </Popover>
  );
}
