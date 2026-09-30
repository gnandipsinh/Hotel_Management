import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Users,
  ConciergeBell,
  Sparkles,
  UtensilsCrossed,
  UserCog,
  Package,
  Wrench,
  ReceiptText,
  BarChart3,
  Bell,
  Settings,
  Building2,
  GitBranch,
  Landmark,
  Blocks,
  ShieldCheck,
  Layers,
  CreditCard,
  HeadphonesIcon,
  Activity,
  ScrollText,
  Sliders,
  Globe,
  Bot,
  Image,
} from "lucide-react";
import type {
  CustomerModuleKey,
  ModuleKey,
  NavigationConfig,
  NavigationFilterOptions,
  NavItem,
  NavSection,
} from "@/types/navigation";

/**
 * Canonical Customer Hotel Navigation Configuration.
 * Every item is linked to a moduleKey so hotels can dynamically show/hide modules
 * according to subscription entitlements and user permissions.
 */
export const hotelNavigationConfig: NavigationConfig = {
  sections: [
    {
      id: "overview",
      title: "Overview",
      items: [
        {
          id: "dashboard",
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          moduleKey: "dashboard",
        },
      ],
    },
    {
      id: "front-office",
      title: "Front Office & Guests",
      items: [
        {
          id: "bookings",
          title: "Bookings",
          href: "/bookings",
          icon: CalendarCheck,
          moduleKey: "bookings",
          badge: 8,
          badgeVariant: "default",
          children: [
            {
              id: "bookings-all",
              title: "All Bookings",
              href: "/bookings",
              icon: CalendarCheck,
              moduleKey: "bookings",
            },
            {
              id: "bookings-new",
              title: "New Booking",
              href: "/bookings/new",
              icon: CalendarCheck,
              moduleKey: "bookings",
            },
            {
              id: "bookings-calendar",
              title: "Calendar Matrix",
              href: "/bookings/calendar",
              icon: CalendarCheck,
              moduleKey: "bookings",
            },
          ],
        },
        {
          id: "reception",
          title: "Reception & Desk",
          href: "/reception",
          icon: ConciergeBell,
          moduleKey: "reception",
          badge: "Live",
          badgeVariant: "success",
          children: [
            {
              id: "reception-arrivals",
              title: "Today's Arrivals",
              href: "/reception/arrivals",
              icon: ConciergeBell,
              moduleKey: "reception",
            },
            {
              id: "reception-departures",
              title: "Today's Departures",
              href: "/reception/departures",
              icon: ConciergeBell,
              moduleKey: "reception",
            },
            {
              id: "reception-room-assignment",
              title: "Room Assignment",
              href: "/reception/assign",
              icon: ConciergeBell,
              moduleKey: "reception",
            },
          ],
        },
        {
          id: "guests",
          title: "Guest Directory",
          href: "/guests",
          icon: Users,
          moduleKey: "guests",
        },
      ],
    },
    {
      id: "operations",
      title: "Property Operations",
      items: [
        {
          id: "rooms",
          title: "Rooms & Units",
          href: "/rooms",
          icon: BedDouble,
          moduleKey: "rooms",
          children: [
            {
              id: "rooms-list",
              title: "Room Directory",
              href: "/rooms",
              icon: BedDouble,
              moduleKey: "rooms",
            },
            {
              id: "rooms-types",
              title: "Room Types & Rates",
              href: "/rooms/types",
              icon: BedDouble,
              moduleKey: "rooms",
            },
            {
              id: "rooms-status",
              title: "Status Grid",
              href: "/rooms/grid",
              icon: BedDouble,
              moduleKey: "rooms",
            },
          ],
        },
        {
          id: "housekeeping",
          title: "Housekeeping",
          href: "/housekeeping",
          icon: Sparkles,
          moduleKey: "housekeeping",
          badge: 5,
          badgeVariant: "warning",
          children: [
            {
              id: "housekeeping-board",
              title: "Room Board",
              href: "/housekeeping",
              icon: Sparkles,
              moduleKey: "housekeeping",
            },
            {
              id: "housekeeping-tasks",
              title: "Task Assignment",
              href: "/housekeeping/tasks",
              icon: Sparkles,
              moduleKey: "housekeeping",
            },
          ],
        },
        {
          id: "maintenance",
          title: "Maintenance",
          href: "/maintenance",
          icon: Wrench,
          moduleKey: "maintenance",
        },
        {
          id: "restaurant",
          title: "Restaurant & POS",
          href: "/restaurant",
          icon: UtensilsCrossed,
          moduleKey: "restaurant",
          children: [
            {
              id: "pos-orders",
              title: "Orders & KOT",
              href: "/restaurant/orders",
              icon: UtensilsCrossed,
              moduleKey: "restaurant",
            },
            {
              id: "pos-menu",
              title: "Menu Items",
              href: "/restaurant/menu",
              icon: UtensilsCrossed,
              moduleKey: "restaurant",
            },
          ],
        },
        {
          id: "inventory",
          title: "Inventory & Stock",
          href: "/inventory",
          icon: Package,
          moduleKey: "inventory",
        },
      ],
    },
    {
      id: "administration",
      title: "Finance & People",
      items: [
        {
          id: "finance",
          title: "Billing & Finance",
          href: "/finance",
          icon: ReceiptText,
          moduleKey: "finance",
          children: [
            {
              id: "finance-invoices",
              title: "GST Invoices",
              href: "/finance/invoices",
              icon: ReceiptText,
              moduleKey: "finance",
            },
            {
              id: "finance-folios",
              title: "Guest Folios",
              href: "/finance/folios",
              icon: ReceiptText,
              moduleKey: "finance",
            },
            {
              id: "finance-payments",
              title: "UPI & Payments",
              href: "/finance/payments",
              icon: ReceiptText,
              moduleKey: "finance",
            },
          ],
        },
        {
          id: "staff",
          title: "Staff & Shifts",
          href: "/staff",
          icon: UserCog,
          moduleKey: "staff",
        },
        {
          id: "reports",
          title: "Reports & ADR",
          href: "/reports",
          icon: BarChart3,
          moduleKey: "reports",
        },
      ],
    },
    {
      id: "add-ons",
      title: "Add-Ons & Settings",
      items: [
        {
          id: "website",
          title: "Hotel Website",
          href: "/website",
          icon: Globe,
          moduleKey: "website",
        },
        {
          id: "ai",
          title: "AI Staff Assistant",
          href: "/ai",
          icon: Bot,
          moduleKey: "ai",
          badge: "AI",
          badgeVariant: "secondary",
        },
        {
          id: "notifications",
          title: "Notifications",
          href: "/notifications",
          icon: Bell,
          moduleKey: "notifications",
        },
        {
          id: "settings",
          title: "Hotel Settings",
          href: "/settings",
          icon: Settings,
          moduleKey: "settings",
          children: [
            {
              id: "settings-media",
              title: "Media Library",
              href: "/settings/media",
              icon: Image,
              moduleKey: "settings",
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Separate navigation configuration for our INTERNAL Platform Super Admin control panel.
 * Never confused with hotel customer navigation.
 */
export const internalAdminNavigationConfig: NavigationConfig = {
  sections: [
    {
      id: "platform-overview",
      title: "Platform Overview",
      items: [
        {
          id: "platform-dashboard",
          title: "System Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          moduleKey: "platform_dashboard",
        },
      ],
    },
    {
      id: "tenant-management",
      title: "Tenant Operations",
      items: [
        {
          id: "platform-hotels",
          title: "Customer Hotels",
          href: "/admin/hotels",
          icon: Building2,
          moduleKey: "platform_hotels",
          badge: 48,
          badgeVariant: "default",
        },
        {
          id: "platform-branches",
          title: "Hotel Branches",
          href: "/admin/branches",
          icon: GitBranch,
          moduleKey: "platform_branches",
        },
        {
          id: "platform-customers",
          title: "Client Accounts",
          href: "/admin/customers",
          icon: Landmark,
          moduleKey: "platform_customers",
        },
        {
          id: "platform-modules",
          title: "Module Entitlements",
          href: "/admin/modules",
          icon: Blocks,
          moduleKey: "platform_module_access",
        },
      ],
    },
    {
      id: "subscription-billing",
      title: "Services & Subscriptions",
      items: [
        {
          id: "platform-services",
          title: "Service Plans",
          href: "/admin/services",
          icon: Layers,
          moduleKey: "platform_services",
        },
        {
          id: "platform-subscriptions",
          title: "Active Subscriptions",
          href: "/admin/subscriptions",
          icon: CreditCard,
          moduleKey: "platform_subscriptions",
        },
        {
          id: "platform-users",
          title: "Platform Admins",
          href: "/admin/users",
          icon: ShieldCheck,
          moduleKey: "platform_users",
        },
      ],
    },
    {
      id: "platform-health",
      title: "Support & Health",
      items: [
        {
          id: "platform-support",
          title: "Support Desk",
          href: "/admin/support",
          icon: HeadphonesIcon,
          moduleKey: "platform_support",
          badge: 3,
          badgeVariant: "warning",
        },
        {
          id: "platform-monitoring",
          title: "System Monitoring",
          href: "/admin/monitoring",
          icon: Activity,
          moduleKey: "platform_monitoring",
        },
        {
          id: "platform-audit",
          title: "Platform Audit Logs",
          href: "/admin/audit",
          icon: ScrollText,
          moduleKey: "platform_audit",
        },
        {
          id: "platform-settings",
          title: "Global Configuration",
          href: "/admin/settings",
          icon: Sliders,
          moduleKey: "platform_settings",
        },
      ],
    },
  ],
};

/**
 * Filter navigation items dynamically based on:
 * - enabled modules for the tenant/hotel
 * - user permissions
 * - user role
 * - internal admin status
 */
export function getVisibleNavigation({
  config,
  enabledModules,
  permissions,
}: NavigationFilterOptions): NavigationConfig {
  const filterItem = (item: NavItem): NavItem | null => {
    // If enabledModules is specified, ensure module is enabled
    if (enabledModules && enabledModules.length > 0) {
      if (!(enabledModules as ModuleKey[]).includes(item.moduleKey)) {
        return null;
      }
    }

    // If permission check is needed
    if (item.requiredPermission && permissions && permissions.length > 0) {
      if (!permissions.includes(item.requiredPermission)) {
        return null;
      }
    }

    // Filter children if present
    if (item.children && item.children.length > 0) {
      const filteredChildren = item.children
        .map(filterItem)
        .filter((child): child is NavItem => child !== null);

      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    }

    return item;
  };

  const filteredSections: NavSection[] = config.sections
    .map((section) => {
      const visibleItems = section.items
        .map(filterItem)
        .filter((item): item is NavItem => item !== null);

      return {
        ...section,
        items: visibleItems,
      };
    })
    .filter((section) => section.items.length > 0);

  return {
    sections: filteredSections,
  };
}

/**
 * Resolve the navigation item (and its section/ancestors) that best matches a
 * pathname. Used by breadcrumbs and by the module placeholder route.
 */
export interface NavLookupResult {
  item: NavItem;
  section: NavSection;
  ancestors: NavItem[];
}

const matchesPath = (href: string, pathname: string): boolean =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Resolve the navigation item (and its section/ancestors) that best matches a
 * pathname. The most specific (longest matching href) wins so that `/admin`
 * never shadows `/admin/hotels`. Used by breadcrumbs and the module route.
 */
export function findNavItemByPath(
  config: NavigationConfig,
  pathname: string,
): NavLookupResult | null {
  const candidates: NavLookupResult[] = [];

  const consider = (
    item: NavItem,
    section: NavSection,
    ancestors: NavItem[],
  ): void => {
    if (matchesPath(item.href, pathname)) {
      candidates.push({ item, section, ancestors });
    }
    for (const child of item.children ?? []) {
      consider(child, section, [...ancestors, item]);
    }
  };

  for (const section of config.sections) {
    for (const item of section.items) {
      consider(item, section, []);
    }
  }

  if (candidates.length === 0) return null;

  return candidates.reduce((best, candidate) =>
    candidate.item.href.length > best.item.href.length ? candidate : best,
  );
}

/**
 * Presets for demonstration and testing of module-based visibility
 */
export const DEMO_PRESETS: Record<string, { label: string; modules: CustomerModuleKey[] }> = {
  all: {
    label: "Hotel C — All Modules Enabled",
    modules: [
      "dashboard",
      "bookings",
      "rooms",
      "guests",
      "reception",
      "housekeeping",
      "restaurant",
      "staff",
      "inventory",
      "maintenance",
      "finance",
      "reports",
      "website",
      "ai",
      "notifications",
      "settings",
    ],
  },
  boutique: {
    label: "Hotel A — Boutique (Rooms, Desk, Housekeeping)",
    modules: ["dashboard", "bookings", "rooms", "guests", "reception", "housekeeping", "settings"],
  },
  resort: {
    label: "Hotel B — Full Resort & F&B (Restaurant, Inventory, Finance)",
    modules: [
      "dashboard",
      "bookings",
      "rooms",
      "guests",
      "restaurant",
      "inventory",
      "finance",
      "reports",
      "settings",
    ],
  },
};

/**
 * Mock module presets per demo hotel — demonstrates how a hotel's subscription
 * entitlement drives navigation visibility. Shared by the shell context and
 * the Phase 8 demo-role module resolution (role grants ∩ hotel plan).
 */
export const HOTEL_MODULE_PRESETS: Record<string, CustomerModuleKey[]> = {
  "hotel-01": DEMO_PRESETS.all.modules,
  "hotel-02": DEMO_PRESETS.resort.modules,
  "hotel-03": DEMO_PRESETS.boutique.modules,
};
