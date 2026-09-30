import * as React from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  ConciergeBell,
  CreditCard,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "checkin" | "checkout" | "cleaning" | "payment" | "maintenance" | "general";
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  badge?: string;
}

export interface ActivityTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  activities: ActivityItem[];
  emptyMessage?: string;
}

const TYPE_CONFIG = {
  checkin: {
    icon: ConciergeBell,
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  checkout: {
    icon: CheckCircle2,
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  cleaning: {
    icon: Sparkles,
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  payment: {
    icon: CreditCard,
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  maintenance: {
    icon: Wrench,
    bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  general: {
    icon: Bell,
    bg: "bg-muted text-muted-foreground",
  },
};

export function ActivityTimeline({
  activities,
  emptyMessage = "No recent operations activity logged.",
  className,
  ...props
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col gap-4", className)} {...props}>
      <ol className="relative border-l border-border/60 ml-3.5 space-y-4">
        {activities.map((item) => {
          const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.general;
          const Icon = config.icon;

          return (
            <li key={item.id} className="ml-5 relative">
              {/* Dot Icon */}
              <span
                className={cn(
                  "absolute -left-8 top-0.5 flex size-6 items-center justify-center rounded-full ring-4 ring-background",
                  config.bg,
                )}
              >
                <Icon className="size-3" />
              </span>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">{item.title}</p>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                    <Clock className="size-3" />
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {item.actor && (
                  <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1 pt-0.5">
                    <User className="size-3" />
                    Logged by {item.actor}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
