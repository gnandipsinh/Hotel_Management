import type { LucideIcon } from "lucide-react";

export type CustomerModuleKey =
  | "dashboard"
  | "bookings"
  | "rooms"
  | "guests"
  | "reception"
  | "housekeeping"
  | "restaurant"
  | "staff"
  | "inventory"
  | "maintenance"
  | "finance"
  | "reports"
  | "notifications"
  | "settings"
  | "website"
  | "ai";

export type PlatformModuleKey =
  | "platform_dashboard"
  | "platform_hotels"
  | "platform_branches"
  | "platform_customers"
  | "platform_module_access"
  | "platform_users"
  | "platform_services"
  | "platform_subscriptions"
  | "platform_support"
  | "platform_monitoring"
  | "platform_audit"
  | "platform_settings";

export type ModuleKey = CustomerModuleKey | PlatformModuleKey;

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  moduleKey: ModuleKey;
  requiredPermission?: string;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  disabled?: boolean;
  isExternal?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface NavigationConfig {
  sections: NavSection[];
}

export interface NavigationFilterOptions {
  config: NavigationConfig;
  enabledModules?: CustomerModuleKey[] | PlatformModuleKey[];
  permissions?: string[];
  role?: string;
  isInternalAdmin?: boolean;
}
