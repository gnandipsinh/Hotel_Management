"use client";

import * as React from "react";
import Link from "next/link";
import {
  BellIcon,
  BedDoubleIcon,
  CalendarCheckIcon,
  IndianRupeeIcon,
  InfoIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import type { NotificationCategory, NotificationItem } from "@/types/context";

const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: React.ElementType; tone: string }
> = {
  booking: { label: "Booking", icon: CalendarCheckIcon, tone: "bg-info/15 text-info" },
  payment: { label: "Payment", icon: IndianRupeeIcon, tone: "bg-success/15 text-success" },
  room: { label: "Room", icon: BedDoubleIcon, tone: "bg-primary/10 text-primary" },
  housekeeping: {
    label: "Housekeeping",
    icon: SparklesIcon,
    tone: "bg-warning/20 text-warning-foreground",
  },
  maintenance: { label: "Maintenance", icon: WrenchIcon, tone: "bg-destructive/10 text-destructive" },
  system: { label: "System", icon: InfoIcon, tone: "bg-muted text-muted-foreground" },
};

const FILTERS: { key: NotificationCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "booking", label: "Bookings" },
  { key: "payment", label: "Payments" },
  { key: "room", label: "Rooms" },
  { key: "housekeeping", label: "Housekeeping" },
  { key: "maintenance", label: "Maintenance" },
  { key: "system", label: "System" },
];

/**
 * Notification center UI with read/unread state and category filters.
 * Backend delivery + websockets arrive in a later phase.
 */
export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    MOCK_NOTIFICATIONS,
  );
  const [filter, setFilter] = React.useState<NotificationCategory | "all">("all");

  const unreadCount = notifications.filter((item) => !item.read).length;
  const visible =
    filter === "all"
      ? notifications
      : notifications.filter((item) => item.category === filter);

  const markAllRead = () =>
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true })),
    );

  const markRead = (id: string) =>
    setNotifications((previous) =>
      previous.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className="relative"
        >
          <BellIcon aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[0.625rem] font-semibold text-white"
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        </div>

        <div className="flex gap-1 overflow-x-auto px-4 pb-2">
          {FILTERS.map((item) => (
            <Button
              key={item.key}
              type="button"
              variant={filter === item.key ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setFilter(item.key)}
              className={cn(
                "shrink-0 rounded-full",
                filter === item.key && "font-medium",
              )}
              aria-pressed={filter === item.key}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <ScrollArea className="max-h-[22rem]">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 px-6 py-10 text-center">
              <BellIcon className="size-6 text-muted-foreground/60" aria-hidden="true" />
              <p className="text-sm font-medium">You&rsquo;re all caught up</p>
              <p className="text-xs text-muted-foreground">
                No {filter !== "all" ? CATEGORY_META[filter as NotificationCategory].label.toLowerCase() : ""}{" "}
                notifications right now.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {visible.map((notification) => {
                const meta = CATEGORY_META[notification.category];
                const Icon = meta.icon;
                return (
                  <li key={notification.id}>
                    <Link
                      href={notification.link ?? "/notifications"}
                      onClick={() => markRead(notification.id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left outline-none transition-colors",
                        "hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                        !notification.read && "bg-muted/40",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          meta.tone,
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "truncate text-sm",
                              !notification.read && "font-semibold",
                            )}
                          >
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span
                              aria-label="Unread"
                              className="size-1.5 shrink-0 rounded-full bg-primary"
                            />
                          )}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {notification.message}
                        </span>
                        <span className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="h-4 px-1.5 text-[0.625rem] text-muted-foreground"
                          >
                            {meta.label}
                          </Badge>
                          <span className="text-[0.6875rem] text-muted-foreground/80">
                            {notification.timestamp}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="m-0" />
        <Link
          href="/notifications"
          className="block px-4 py-2.5 text-center text-xs font-medium text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
