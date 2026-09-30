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
