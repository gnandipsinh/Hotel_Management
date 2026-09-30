export * from "./tokens";

export const TYPOGRAPHY_CLASSES = {
  display: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground",
  h1: "text-2xl sm:text-3xl font-semibold tracking-tight text-foreground",
  h2: "text-xl sm:text-2xl font-semibold tracking-tight text-foreground",
  h3: "text-lg sm:text-xl font-semibold text-foreground",
  h4: "text-base font-semibold text-foreground",
  body: "text-sm leading-relaxed text-foreground",
  bodyMuted: "text-sm leading-relaxed text-muted-foreground",
  small: "text-xs text-muted-foreground",
  caption: "text-[11px] font-medium tracking-wide text-muted-foreground",
  label: "text-xs font-medium text-foreground",
  button: "text-xs sm:text-sm font-medium",
} as const;

export const LAYOUT_CLASSES = {
  pageContainer: "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
  contentSplit: "grid grid-cols-1 lg:grid-cols-3 gap-6",
  metricGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
  cardStandard: "rounded-2xl border bg-card p-5 shadow-xs sm:p-6",
  cardGlass: "rounded-2xl border border-white/10 bg-[#0C1022]/75 p-5 shadow-xs backdrop-blur-md sm:p-6",
} as const;

/**
 * Standard semantic design tokens for runtime reference in components
 */
export const DESIGN_CONSTANTS = {
  appName: "HotelHub",
  tagline: "Luxury Multi-Tenant Hotel Management SaaS",
  canvasBackground: "#070A16",
  canvasBackgroundSubtle: "#090D1C",
  surfaceCard: "#0C1022",
  brandPrimary: "#2563EB",
  brandSecondary: "#4F46E5",
  brandAccent: "#06B6D4",
  borderHairline: "rgba(255, 255, 255, 0.10)",
} as const;
