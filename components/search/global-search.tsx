"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MOCK_SEARCH_RESULTS } from "@/lib/mock-data";
import type { SearchCategory, SearchResultItem } from "@/types/context";

const CATEGORY_ORDER: { key: SearchCategory; label: string }[] = [
  { key: "guests", label: "Guests" },
  { key: "bookings", label: "Bookings" },
  { key: "rooms", label: "Rooms" },
  { key: "staff", label: "Staff" },
  { key: "invoices", label: "Invoices" },
  { key: "inventory", label: "Inventory" },
  { key: "reports", label: "Reports" },
];

function filterResults(results: SearchResultItem[], query: string): SearchResultItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return results;
  return results.filter(
    (result) =>
      result.title.toLowerCase().includes(normalized) ||
      result.subtitle.toLowerCase().includes(normalized) ||
      result.category.includes(normalized) ||
      result.badge?.toLowerCase().includes(normalized),
  );
}

/**
 * Global search UI with demo results. Database-backed search is a later phase —
 * this component only owns presentation and keyboard shortcuts.
 */
export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = filterResults(MOCK_SEARCH_RESULTS, query);

  const selectResult = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-label="Open global search"
        onClick={() => setOpen(true)}
        className={cn(
          "h-8 w-8 justify-center px-0 text-muted-foreground",
          "md:h-8 md:w-auto md:justify-start md:gap-2 md:px-2.5 md:opacity-90",
          className,
        )}
      >
        <SearchIcon aria-hidden="true" />
        <span className="hidden md:inline">Search guests, bookings, rooms…</span>
        <kbd className="pointer-events-none hidden h-5 items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[0.625rem] font-medium md:ml-auto md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setQuery("");
        }}
      >
        <CommandInput
          placeholder="Type to search across the hotel…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            No results found for &ldquo;{query}&rdquo;. Try a guest name, booking
            number or room number.
          </CommandEmpty>
          {CATEGORY_ORDER.map(({ key, label }) => {
            const items = results.filter((result) => result.category === key);
            if (items.length === 0) return null;
            return (
              <CommandGroup key={key} heading={label}>
                {items.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={`${result.title} ${result.subtitle}`}
                    onSelect={() => selectResult(result.href)}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{result.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    </span>
                    {result.badge && (
                      <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-[0.6875rem] text-muted-foreground">
                        {result.badge}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
