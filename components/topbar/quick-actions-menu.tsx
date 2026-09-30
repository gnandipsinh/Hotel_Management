"use client";

import Link from "next/link";
import {
  BedDoubleIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
  ReceiptTextIcon,
  SparklesIcon,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QUICK_ACTIONS = [
  { label: "New Booking", href: "/bookings/new", icon: CalendarPlusIcon },
  { label: "Walk-in Guest", href: "/reception", icon: BedDoubleIcon },
  { label: "Add Guest", href: "/guests", icon: UserPlusIcon },
  { label: "New Invoice", href: "/finance/invoices", icon: ReceiptTextIcon },
  { label: "Housekeeping Task", href: "/housekeeping/tasks", icon: SparklesIcon },
];

export function QuickActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" aria-label="Open quick actions menu">
          <span className="hidden sm:inline">Quick actions</span>
          <span className="sm:hidden">New</span>
          <ChevronDownIcon aria-hidden="true" className="size-3.5 opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Create new
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem key={action.label} asChild>
              <Link href={action.href}>
                <Icon aria-hidden="true" />
                {action.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
