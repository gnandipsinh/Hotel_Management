export interface ModuleCatalogEntry {
  key: string;
  name: string;
  description?: string;
  iconKey?: string;
  category: "administration" | "operations" | "finance" | "commercial";
  isActive: boolean;
}

export const MODULE_CATALOG: ModuleCatalogEntry[] = [
  {
    key: "hotel_super_admin",
    name: "Hotel Super Admin",
    description: "Platform administration for hotel operations",
    iconKey: "ShieldCheck",
    category: "administration",
    isActive: true,
  },
  {
    key: "manager",
    name: "Manager",
    description: "Hotel management and oversight dashboard",
    iconKey: "Briefcase",
    category: "administration",
    isActive: true,
  },
  {
    key: "receptionist",
    name: "Receptionist",
    description: "Front desk operations and guest check-in/out",
    iconKey: "ConciergeBell",
    category: "operations",
    isActive: true,
  },
  {
    key: "rooms",
    name: "Room Management",
    description: "Room types, inventory, and availability",
    iconKey: "BedDouble",
    category: "operations",
    isActive: true,
  },
  {
    key: "bookings",
    name: "Booking Management",
    description: "Reservations, availability, and booking engine",
    iconKey: "CalendarCheck",
    category: "commercial",
    isActive: true,
  },
  {
    key: "guests",
    name: "Guest Management",
    description: "Guest profiles, preferences, and history",
    iconKey: "Users",
    category: "operations",
    isActive: true,
  },
  {
    key: "housekeeping",
    name: "Housekeeping",
    description: "Room cleaning schedules and task management",
    iconKey: "Sparkles",
    category: "operations",
    isActive: true,
  },
  {
    key: "restaurant",
    name: "Restaurant/POS",
    description: "Point of sale, menu, and dining operations",
    iconKey: "UtensilsCrossed",
    category: "commercial",
    isActive: true,
  },
  {
    key: "staff",
    name: "Staff Management",
    description: "Employee records, shifts, and attendance",
    iconKey: "UserCog",
    category: "administration",
    isActive: true,
  },
  {
    key: "inventory",
    name: "Inventory",
    description: "Stock control, purchase orders, and suppliers",
    iconKey: "Package",
    category: "operations",
    isActive: true,
  },
  {
    key: "finance",
    name: "Finance/Accounts",
    description: "Billing, invoicing, and financial reporting",
    iconKey: "ReceiptText",
    category: "finance",
    isActive: true,
  },
  {
    key: "maintenance",
    name: "Maintenance",
    description: "Asset tracking and maintenance scheduling",
    iconKey: "Wrench",
    category: "operations",
    isActive: true,
  },
  {
    key: "security",
    name: "Security",
    description: "Access control, surveillance, and safety protocols",
    iconKey: "ShieldAlert",
    category: "administration",
    isActive: true,
  },
];

const MODULE_PREFIX_MAP: Record<string, string> = {
  rooms: "room",
  bookings: "booking",
  guests: "guest",
  finance: "finance",
  housekeeping: "housekeeping",
  restaurant: "restaurant",
  staff: "staff",
  inventory: "inventory",
  maintenance: "maintenance",
  security: "security",
};

const CORE_ACTIONS = ["view", "create", "update", "delete"] as const;

export const PERMISSION_MATRIX = MODULE_CATALOG
  .filter((m) => MODULE_PREFIX_MAP[m.key])
  .flatMap((module) => {
    const prefix = MODULE_PREFIX_MAP[module.key];
    return CORE_ACTIONS.map((action) => ({
      key: `${prefix}.${action}`,
      module: module.key,
      action,
      description: `Allow ${action} access to ${module.name.toLowerCase()}`,
    }));
  });

export const SYSTEM_ROLES = [
  {
    name: "Hotel Super Admin",
    description: "Full access to all hotel operations and settings",
    permissionKeys: PERMISSION_MATRIX.map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Manager",
    description: "Operational oversight with reporting access",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Receptionist",
    description: "Front desk operations: check-in, check-out, guest management",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => ["booking", "guest", "room"].some((m) => p.module === m) && ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Accountant",
    description: "Financial operations: invoicing, payments, reporting",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => p.module === "finance" && ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Housekeeping",
    description: "Room cleaning and maintenance task management",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => p.module === "housekeeping" && ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Restaurant Staff",
    description: "POS operations and menu management",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => p.module === "restaurant" && ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Inventory Staff",
    description: "Stock management and purchase orders",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => p.module === "inventory" && ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
  {
    name: "Maintenance Staff",
    description: "Asset maintenance and repair tracking",
    permissionKeys: PERMISSION_MATRIX
      .filter((p) => p.module === "maintenance" && ["view", "create", "update"].includes(p.action))
      .map((p) => p.key),
    isSystemRole: true,
  },
];