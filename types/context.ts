export interface HotelInfo {
  id: string;
  name: string;
  code: string;
  brandName?: string;
  logoUrl?: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  branchesCount: number;
}

export interface BranchInfo {
  id: string;
  hotelId: string;
  name: string;
  code: string;
  isMain: boolean;
  address: string;
  city: string;
  phone: string;
  roomsCount: number;
  status: "active" | "maintenance";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  roleName: string;
  avatarUrl?: string;
  assignedBranchIds: string[];
  isPlatformAdmin?: boolean;
}

/**
 * TenantContext represents the resolved multi-tenant security boundary
 * for incoming API requests and Server Actions.
 */
export interface TenantContext {
  /** The tenant hotel id (MongoDB ObjectId string) */
  hotelId: string;
  /** Optional active branch context within the hotel */
  branchId?: string;
  /** Resolved user performing the request */
  user?: {
    id: string;
    role: string;
    allowedBranches: string[];
    isPlatformAdmin: boolean;
  };
}

export type NotificationCategory =
  | "booking"
  | "payment"
  | "room"
  | "housekeeping"
  | "maintenance"
  | "system";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: NotificationCategory;
  link?: string;
}

export type SearchCategory =
  | "guests"
  | "bookings"
  | "rooms"
  | "staff"
  | "invoices"
  | "inventory"
  | "reports";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  badge?: string;
  metadata?: string;
}
