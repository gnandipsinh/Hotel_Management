import Link from "next/link";
import type { ElementType } from "react";
import {
  BedDoubleIcon,
  CalendarCheckIcon,
  IndianRupeeIcon,
  InfoIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import type { NotificationCategory } from "@/types/context";

const ICONS: Record<NotificationCategory, ElementType> = {
  booking: CalendarCheckIcon,
  payment: IndianRupeeIcon,
  room: BedDoubleIcon,
  housekeeping: SparklesIcon,
  maintenance: WrenchIcon,
  system: InfoIcon,
};

const TONES: Record<NotificationCategory, string> = {
  booking: "bg-info/15 text-info",
  payment: "bg-success/15 text-success",
  room: "bg-primary/10 text-primary",
  housekeeping: "bg-warning/20 text-warning-foreground",
  maintenance: "bg-destructive/10 text-destructive",
  system: "bg-muted text-muted-foreground",
};

/** Recent activity feed for the dashboard. */
export function ActivityFeed({ items = MOCK_NOTIFICATIONS.slice(0, 5) }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
        <Link href="/notifications" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const Icon = ICONS[item.category];
            return (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
                    TONES[item.category],
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">{item.title}</span>
                  <span className="mt-0.5 line-clamp-2 text-[0.6875rem] leading-relaxed text-muted-foreground">
                    {item.message}
                  </span>
                </span>
                <span className="shrink-0 text-[0.625rem] text-muted-foreground/80">
                  {item.timestamp}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
