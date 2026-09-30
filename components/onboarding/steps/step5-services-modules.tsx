"use client";

import * as React from "react";
import {
  BarChart3Icon,
  BedDoubleIcon,
  BellIcon,
  BlocksIcon,
  BotIcon,
  CalendarCheckIcon,
  CheckIcon,
  ConciergeBellIcon,
  GlobeIcon,
  PackageIcon,
  ReceiptTextIcon,
  SettingsIcon,
  SparklesIcon,
  UserCogIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  WrenchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_MODULES } from "@/config/onboarding";
import type { CustomerModuleKey } from "@/types/navigation";
import type { UseOnboardingReturn } from "@/lib/onboarding/use-onboarding";

interface Step5Props {
  onboarding: UseOnboardingReturn;
}

const MODULE_ICONS: Record<CustomerModuleKey, React.ComponentType<{ className?: string }>> = {
  dashboard: BarChart3Icon,
  reception: ConciergeBellIcon,
  rooms: BedDoubleIcon,
  bookings: CalendarCheckIcon,
  guests: UsersIcon,
  housekeeping: SparklesIcon,
  restaurant: UtensilsCrossedIcon,
  staff: UserCogIcon,
  inventory: PackageIcon,
  maintenance: WrenchIcon,
  finance: ReceiptTextIcon,
  reports: BarChart3Icon,
  website: GlobeIcon,
  ai: BotIcon,
  notifications: BellIcon,
  settings: SettingsIcon,
};

export function Step5ServicesModules({ onboarding }: Step5Props) {
  const {
    state,
    errors,
    toggleModule,
    selectAllModules,
    selectRecommendedModules,
    clearModules,
  } = onboarding;
  const { modules } = state;
  const selected = modules.selectedKeys;

  const allKeys = AVAILABLE_MODULES.map((m) => m.key);
  const recKeys = AVAILABLE_MODULES.filter((m) => m.recommended).map((m) => m.key);

  const categories = [
    "All",
    "Front Office",
    "Operations",
    "Commercial",
    "Finance & Control",
    "Smart Tools",
  ] as const;

  const [activeCategory, setActiveCategory] = React.useState<string>("All");

  const filteredModules = React.useMemo(() => {
    if (activeCategory === "All") return AVAILABLE_MODULES;
    return AVAILABLE_MODULES.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
          <BlocksIcon className="size-4" aria-hidden="true" />
          <span>Step 5 · Entitlements & Features</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Services & Module Entitlements
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tailor the operational suite to your exact hospitality format. Staff and department dashboards adapt automatically.
        </p>
      </div>

      {/* Overview and Quick Presets Card */}
      <section className="rounded-xl border bg-card p-5 shadow-xs sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Operational Modules</h3>
              <Badge variant="outline" className="text-xs">
                {selected.length} of {AVAILABLE_MODULES.length} Active
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Select only the modules required by your property. You can enable or disable additional modules at any time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => selectRecommendedModules(recKeys)}
            >
              Recommended Plan ({recKeys.length})
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => selectAllModules(allKeys)}
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={clearModules}
            >
              Clear
            </Button>
          </div>
        </div>

        {errors.modules && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {errors.modules}
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="mt-5 flex flex-wrap gap-1.5 border-b pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((mod) => {
            const isSelected = selected.includes(mod.key);
            const Icon = MODULE_ICONS[mod.key] || BlocksIcon;

            return (
              <div
                key={mod.key}
                onClick={() => toggleModule(mod.key)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4.5 transition-all select-none ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs dark:bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="flex items-center gap-1.5">
                      {mod.recommended && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-medium"
                        >
                          Recommended
                        </Badge>
                      )}
                      <div
                        className={`flex size-5 items-center justify-center rounded-md border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background"
                        }`}
                      >
                        {isSelected && <CheckIcon className="size-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  <h4 className="mt-3 text-sm font-semibold text-foreground">
                    {mod.name}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px]">
                  <span className="text-muted-foreground">{mod.category}</span>
                  <span
                    className={`font-medium ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {isSelected ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
