"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { CheckIcon, MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

const emptySubscribe = () => () => {};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // Hydration-safe "mounted" signal without setState-in-effect.
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const activeTheme: ThemeOption =
    mounted && (theme === "light" || theme === "dark") ? theme : "system";

  const ActiveIcon = THEME_OPTIONS.find((option) => option.value === activeTheme)?.icon ?? MonitorIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Change theme (current: ${activeTheme})`}
        >
          <ActiveIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setTheme(option.value)}
              aria-checked={activeTheme === option.value}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{option.label}</span>
              {activeTheme === option.value && (
                <CheckIcon className="ml-auto size-4" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
