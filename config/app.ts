/**
 * Centralized Application Configuration
 *
 * Provides application-level metadata, branding constants, supported
 * currencies, tax slabs, and system limits for HotelHub SaaS.
 */

export const APP_CONFIG = {
  name: "HotelHub",
  tagline: "Enterprise Hotel Management SaaS",
  version: "0.1.0",
  description:
    "All-in-one cloud platform for hotel reservations, front desk PMS, housekeeping, Bharat QR payments, and GST invoicing.",
  company: "HotelHub Technologies Inc.",
  supportEmail: "support@hotelhub.local",
  contactPhone: "+91 98765 43210",
  defaultLocale: "en-IN",
  defaultCurrency: "INR",
  currencySymbol: "₹",
  defaultTimezone: "Asia/Kolkata",

  // Indian Hospitality Tax Slabs (SAC 9963)
  gst: {
    lowSlabThreshold: 7500, // Tariff <= ₹7,500/night -> 12% GST
    lowSlabRate: 12,
    highSlabRate: 18, // Tariff > ₹7,500/night -> 18% GST
    restaurantGstRate: 5, // Standalone restaurant / non-composite -> 5%
    hsnSacLodging: "996311",
    hsnSacRestaurant: "996331",
  },

  // Pagination defaults across table views
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },

  // Storage limits
  storage: {
    maxFileSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    allowedDocumentTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
} as const;
