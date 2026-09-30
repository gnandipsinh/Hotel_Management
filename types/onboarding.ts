import type { CustomerModuleKey } from "@/types/navigation";
import type { FileAssetDto } from "@/types/media";

export type HotelType =
  | "Hotel"
  | "Resort"
  | "Boutique Hotel"
  | "Business Hotel"
  | "Guest House"
  | "Homestay"
  | "Hostel"
  | "Heritage Hotel"
  | "Other";

export type StarRating =
  | "5 Star Luxury"
  | "4 Star Premium"
  | "3 Star Comfort"
  | "2 Star Standard"
  | "1 Star Economy"
  | "Boutique Heritage"
  | "Unrated";

export interface OnboardingHotelInfo {
  name: string;
  legalName: string;
  type: HotelType;
  starRating: StarRating;
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  gstNumber?: string;
}

export interface OnboardingBranding {
  logo: FileAssetDto | null;
  cover: FileAssetDto | null;
  gallery: FileAssetDto[];
}

export interface OnboardingBranch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  managerName: string;
  isPrimary: boolean;
}

export interface OnboardingPropertyConfig {
  floors: number;
  totalRooms: number;
  roomCategories: string[];
  checkInTime: string;
  checkOutTime: string;
  currency: string;
  timeZone: string;
  weekStart: "monday" | "sunday";
  gstRate: number;
  isGstRegistered: boolean;
  pricesTaxInclusive: boolean;
}

export interface OnboardingModuleSelection {
  selectedKeys: CustomerModuleKey[];
}

export interface OnboardingPayment {
  upiId: string;
  upiQr: FileAssetDto | null;
  displayName: string;
  bankNotes?: string;
}

export interface OnboardingState {
  currentStep: number; // 1-indexed (1 to 7)
  completedSteps: number[];
  hotel: OnboardingHotelInfo;
  branding: OnboardingBranding;
  branches: OnboardingBranch[];
  property: OnboardingPropertyConfig;
  modules: OnboardingModuleSelection;
  payment: OnboardingPayment;
  isCompleted: boolean;
  completedAt?: string;
}

export interface StepDefinition {
  step: number;
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  badge?: string;
  estimatedMinutes: number;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
