import type {
  HotelType,
  OnboardingState,
  StarRating,
  StepDefinition,
  StepValidationResult,
} from "@/types/onboarding";
import type { CustomerModuleKey } from "@/types/navigation";

export const ONBOARDING_STORAGE_KEY = "hotelsync.onboarding-state.v2";

export const ONBOARDING_STEPS: StepDefinition[] = [
  {
    step: 1,
    id: "hotel_info",
    title: "Hotel Information",
    shortTitle: "Hotel Info",
    description: "Property identification, contact info & legal credentials",
    badge: "Identity",
    estimatedMinutes: 2,
  },
  {
    step: 2,
    id: "branding",
    title: "Hotel Branding",
    shortTitle: "Branding",
    description: "Logo, high-resolution cover banner & photo showcase",
    badge: "Media",
    estimatedMinutes: 2,
  },
  {
    step: 3,
    id: "branches",
    title: "Branch Setup",
    shortTitle: "Branches",
    description: "Multi-property management & primary operating branch",
    badge: "Topology",
    estimatedMinutes: 2,
  },
  {
    step: 4,
    id: "property_config",
    title: "Property Configuration",
    shortTitle: "Configuration",
    description: "Floors, rooms, operational timings & tax presets",
    badge: "Operations",
    estimatedMinutes: 2,
  },
  {
    step: 5,
    id: "services_modules",
    title: "Services & Modules",
    shortTitle: "Modules",
    description: "Enable the exact functional modules for your staff",
    badge: "Entitlements",
    estimatedMinutes: 1,
  },
  {
    step: 6,
    id: "payment_upi",
    title: "Payment & UPI",
    shortTitle: "Payments",
    description: "Instant UPI QR collection, payee display & settlement notes",
    badge: "Settlement",
    estimatedMinutes: 1,
  },
  {
    step: 7,
    id: "review_finish",
    title: "Review & Launch",
    shortTitle: "Review",
    description: "Final verification and tenant workspace initialization",
    badge: "Ready",
    estimatedMinutes: 1,
  },
];

export const HOTEL_TYPE_OPTIONS: HotelType[] = [
  "Hotel",
  "Resort",
  "Boutique Hotel",
  "Business Hotel",
  "Heritage Hotel",
  "Guest House",
  "Homestay",
  "Hostel",
  "Other",
];

export const STAR_RATING_OPTIONS: StarRating[] = [
  "5 Star Luxury",
  "4 Star Premium",
  "3 Star Comfort",
  "2 Star Standard",
  "1 Star Economy",
  "Boutique Heritage",
  "Unrated",
];

export const ROOM_CATEGORY_PRESETS = [
  "Standard Room",
  "Deluxe Room",
  "Executive Suite",
  "Presidential Suite",
  "Heritage Villa",
  "Family Suite",
  "Club Room",
  "Dormitory",
];

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "AED", label: "UAE Dirham (AED)", symbol: "AED" },
  { value: "SGD", label: "Singapore Dollar (S$)", symbol: "S$" },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST, GMT+5:30)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST, GMT+4:00)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT, GMT+8:00)" },
  { value: "Europe/London", label: "London / GMT (GMT+0:00 / +1:00)" },
  { value: "America/New_York", label: "Eastern Time (EST, GMT-5:00)" },
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
];

export interface ModuleOptionConfig {
  key: CustomerModuleKey;
  name: string;
  category: "Front Office" | "Operations" | "Commercial" | "Finance & Control" | "Smart Tools";
  description: string;
  recommended: boolean;
  core: boolean;
}

export const AVAILABLE_MODULES: ModuleOptionConfig[] = [
  {
    key: "reception",
    name: "Reception & Desk",
    category: "Front Office",
    description: "Check-in/out console, arrivals roster, keycards & room handovers.",
    recommended: true,
    core: true,
  },
  {
    key: "rooms",
    name: "Room Inventory",
    category: "Operations",
    description: "Live floor grid, clean/dirty states, lockouts and room classes.",
    recommended: true,
    core: true,
  },
  {
    key: "bookings",
    name: "Bookings & Calendar",
    category: "Commercial",
    description: "Matrix calendar, rate-calendar, walk-ins & online reservations.",
    recommended: true,
    core: true,
  },
  {
    key: "guests",
    name: "Guest Directory",
    category: "Front Office",
    description: "Guest histories, VIP flags, KYC IDs and stay preferences.",
    recommended: true,
    core: false,
  },
  {
    key: "housekeeping",
    name: "Housekeeping",
    category: "Operations",
    description: "Turnover queues, maid assignments, inspection logs & mini-bar.",
    recommended: true,
    core: false,
  },
  {
    key: "restaurant",
    name: "Restaurant & POS",
    category: "Commercial",
    description: "F&B table billing, KOT generation, in-room dining & menu engineering.",
    recommended: false,
    core: false,
  },
  {
    key: "finance",
    name: "Billing & Finance",
    category: "Finance & Control",
    description: "Guest folios, GST tax invoices, UPI logs & split billings.",
    recommended: true,
    core: true,
  },
  {
    key: "staff",
    name: "Staff & Shifts",
    category: "Operations",
    description: "Duty rosters, biometric/attendance checks & staff roles.",
    recommended: false,
    core: false,
  },
  {
    key: "inventory",
    name: "Inventory & Par Stock",
    category: "Operations",
    description: "Linen, toiletries, kitchen supplies, purchase orders & reorder levels.",
    recommended: false,
    core: false,
  },
  {
    key: "maintenance",
    name: "Maintenance & Engineering",
    category: "Operations",
    description: "Ticket dispatch, HVAC/plumbing work orders & asset lifecycles.",
    recommended: false,
    core: false,
  },
  {
    key: "reports",
    name: "Reports & Analytics",
    category: "Finance & Control",
    description: "ADR, RevPAR, occupancy curves, cashier closes & tax summaries.",
    recommended: true,
    core: false,
  },
  {
    key: "website",
    name: "Direct Booking Website",
    category: "Commercial",
    description: "Commission-free branded booking portal with instant confirmations.",
    recommended: false,
    core: false,
  },
  {
    key: "ai",
    name: "AI Guest Concierge",
    category: "Smart Tools",
    description: "24/7 WhatsApp & room QR AI assistant for itineraries and requests.",
    recommended: false,
    core: false,
  },
  {
    key: "notifications",
    name: "Alerts & Notifications",
    category: "Smart Tools",
    description: "Automated SMS/WhatsApp reminders for arrivals and folio receipts.",
    recommended: true,
    core: false,
  },
  {
    key: "settings",
    name: "Hotel Settings",
    category: "Finance & Control",
    description: "Property policies, media assets, tax slabs and branch links.",
    recommended: true,
    core: true,
  },
];

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStep: 1,
  completedSteps: [],
  hotel: {
    name: "The Royal Mirage Palace",
    legalName: "Mirage Hospitality Private Limited",
    type: "Boutique Hotel",
    starRating: "5 Star Luxury",
    email: "concierge@royalmirage.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 98765 43211",
    website: "https://royalmirage.com",
    address: "Palace Road, Near Lake Pichola",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    postalCode: "313001",
    gstNumber: "08AAAAA0000A1Z5",
  },
  branding: {
    logo: {
      id: "demo-logo-asset",
      hotelId: "hotel-onboarding",
      originalName: "royal-mirage-crest.png",
      storageProvider: "local",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=80",
      mimeType: "image/png",
      extension: "png",
      size: 142800,
      category: "hotel_logo",
      status: "active",
      access: "public",
      sortOrder: 0,
      isPrimary: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    cover: {
      id: "demo-cover-asset",
      hotelId: "hotel-onboarding",
      originalName: "palace-facade-sunset.jpg",
      storageProvider: "local",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80",
      mimeType: "image/jpeg",
      extension: "jpg",
      size: 894200,
      category: "hotel_cover",
      status: "active",
      access: "public",
      sortOrder: 0,
      isPrimary: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    gallery: [
      {
        id: "demo-gallery-1",
        hotelId: "hotel-onboarding",
        originalName: "heritage-courtyard.jpg",
        storageProvider: "local",
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
        mimeType: "image/jpeg",
        extension: "jpg",
        size: 512000,
        category: "hotel_gallery",
        status: "active",
        access: "public",
        sortOrder: 1,
        isPrimary: true,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "demo-gallery-2",
        hotelId: "hotel-onboarding",
        originalName: "royal-suite-view.jpg",
        storageProvider: "local",
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
        mimeType: "image/jpeg",
        extension: "jpg",
        size: 642000,
        category: "hotel_gallery",
        status: "active",
        access: "public",
        sortOrder: 2,
        isPrimary: false,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "demo-gallery-3",
        hotelId: "hotel-onboarding",
        originalName: "infinity-pool.jpg",
        storageProvider: "local",
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
        mimeType: "image/jpeg",
        extension: "jpg",
        size: 478000,
        category: "hotel_gallery",
        status: "active",
        access: "public",
        sortOrder: 3,
        isPrimary: false,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
  branches: [
    {
      id: "branch-primary-01",
      name: "The Royal Mirage Heritage — Lake Pichola",
      code: "UDR-MAIN",
      address: "Palace Road, Near Lake Pichola",
      city: "Udaipur",
      state: "Rajasthan",
      postalCode: "313001",
      phone: "+91 98765 43210",
      email: "udaipur@royalmirage.com",
      managerName: "Vikramaditya Rathore",
      isPrimary: true,
    },
  ],
  property: {
    floors: 4,
    totalRooms: 68,
    roomCategories: ["Deluxe Lake View", "Heritage Suite", "Royal Villa", "Palace Courtyard"],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    currency: "INR",
    timeZone: "Asia/Kolkata",
    weekStart: "monday",
    gstRate: 18,
    isGstRegistered: true,
    pricesTaxInclusive: true,
  },
  modules: {
    selectedKeys: [
      "reception",
      "rooms",
      "bookings",
      "guests",
      "housekeeping",
      "finance",
      "reports",
      "notifications",
      "settings",
    ],
  },
  payment: {
    upiId: "royalmirage@okhdfcbank",
    upiQr: {
      id: "demo-upi-qr",
      hotelId: "hotel-onboarding",
      originalName: "royal-mirage-upi-qr.png",
      storageProvider: "local",
      url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      mimeType: "image/png",
      extension: "png",
      size: 92300,
      category: "upi_qr",
      status: "active",
      access: "public",
      sortOrder: 0,
      isPrimary: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    displayName: "The Royal Mirage Hospitality Ltd",
    bankNotes: "For instant booking confirmation, specify your Reservation ID in the UPI remarks.",
  },
  isCompleted: false,
};

// ── Step Validations ──────────────────────────────────────────────────────────

export function validateStep1(hotel: OnboardingState["hotel"]): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!hotel.name.trim()) errors.name = "Hotel name is required";
  if (!hotel.legalName.trim()) errors.legalName = "Legal / registered entity name is required";
  if (!hotel.type) errors.type = "Select a hotel property type";
  if (!hotel.starRating) errors.starRating = "Select a category / star rating";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!hotel.email.trim()) {
    errors.email = "Primary email address is required";
  } else if (!emailRegex.test(hotel.email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  const phoneDigits = hotel.phone.replace(/[^0-9]/g, "");
  if (!hotel.phone.trim()) {
    errors.phone = "Primary phone number is required";
  } else if (phoneDigits.length < 8) {
    errors.phone = "Phone number must have at least 8 digits";
  }

  if (hotel.alternatePhone && hotel.alternatePhone.trim()) {
    const altDigits = hotel.alternatePhone.replace(/[^0-9]/g, "");
    if (altDigits.length < 8) {
      errors.alternatePhone = "Alternate phone must have at least 8 digits";
    }
  }

  if (hotel.website && hotel.website.trim()) {
    try {
      const url = new URL(hotel.website.trim());
      if (!url.protocol.startsWith("http")) {
        errors.website = "Website URL must start with http:// or https://";
      }
    } catch {
      errors.website = "Please enter a valid website URL (e.g. https://yourhotel.com)";
    }
  }

  if (!hotel.address.trim()) errors.address = "Property street address is required";
  if (!hotel.city.trim()) errors.city = "City is required";
  if (!hotel.state.trim()) errors.state = "State / Province is required";
  if (!hotel.country.trim()) errors.country = "Country is required";

  const postalClean = hotel.postalCode.trim();
  if (!postalClean) {
    errors.postalCode = "Postal code / PIN is required";
  } else if (postalClean.length < 3) {
    errors.postalCode = "Postal code must be at least 3 characters";
  }

  if (hotel.gstNumber && hotel.gstNumber.trim()) {
    const gstClean = hotel.gstNumber.trim().toUpperCase();
    // 15-character GSTIN format: 2 digits + 10 alphanumeric PAN + 1 entity num + 'Z' + 1 check digit
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gstClean) && gstClean.length !== 15) {
      errors.gstNumber = "Invalid GSTIN format (15 characters: e.g. 08AAAAA0000A1Z5)";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(branding: OnboardingState["branding"]): StepValidationResult {
  const errors: Record<string, string> = {};
  // For branding, logo or cover can be optional or required per spec:
  // "Step 2 — Hotel Branding: Support Hotel Logo, Cover Image, Gallery Images.
  // Validate before continuing."
  if (!branding.logo) {
    errors.logo = "Please provide or keep a hotel logo";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(branches: OnboardingState["branches"]): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!branches || branches.length === 0) {
    errors.branches = "At least one operating branch is required";
    return { isValid: false, errors };
  }

  const hasPrimary = branches.some((b) => b.isPrimary);
  if (!hasPrimary) {
    errors.primary = "One branch must be designated as the Primary branch";
  }

  const codes = new Set<string>();
  branches.forEach((branch, idx) => {
    if (!branch.name.trim()) {
      errors[`branch_${idx}_name`] = `Branch #${idx + 1} requires a name`;
    }
    const cleanCode = branch.code.trim().toUpperCase();
    if (!cleanCode) {
      errors[`branch_${idx}_code`] = `Branch #${idx + 1} requires a branch code`;
    } else if (codes.has(cleanCode)) {
      errors[`branch_${idx}_code`] = `Duplicate branch code "${cleanCode}"`;
    } else {
      codes.add(cleanCode);
    }
    if (!branch.city.trim()) {
      errors[`branch_${idx}_city`] = `Branch #${idx + 1} requires a city`;
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep4(property: OnboardingState["property"]): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!property.floors || property.floors < 1) {
    errors.floors = "Floors count must be at least 1";
  }
  if (!property.totalRooms || property.totalRooms < 1) {
    errors.totalRooms = "Total room count must be at least 1";
  }
  if (!property.roomCategories || property.roomCategories.length === 0) {
    errors.roomCategories = "Configure at least one room category";
  }
  if (!property.checkInTime) {
    errors.checkInTime = "Check-in time is required";
  }
  if (!property.checkOutTime) {
    errors.checkOutTime = "Check-out time is required";
  }
  if (!property.currency) {
    errors.currency = "Select a default operating currency";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep5(modules: OnboardingState["modules"]): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!modules.selectedKeys || modules.selectedKeys.length === 0) {
    errors.modules = "Select at least one functional module to activate for your hotel";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep6(payment: OnboardingState["payment"]): StepValidationResult {
  const errors: Record<string, string> = {};

  if (payment.upiId && payment.upiId.trim()) {
    const upiClean = payment.upiId.trim();
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiClean)) {
      errors.upiId = "Enter a valid UPI VPA handle (e.g. hotelname@okhdfcbank)";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep(step: number, state: OnboardingState): StepValidationResult {
  switch (step) {
    case 1:
      return validateStep1(state.hotel);
    case 2:
      return validateStep2(state.branding);
    case 3:
      return validateStep3(state.branches);
    case 4:
      return validateStep4(state.property);
    case 5:
      return validateStep5(state.modules);
    case 6:
      return validateStep6(state.payment);
    case 7:
      return { isValid: true, errors: {} };
    default:
      return { isValid: true, errors: {} };
  }
}
