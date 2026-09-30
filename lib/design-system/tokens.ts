/**
 * ============================================================================
 * HOTELHUB MASTER DESIGN SYSTEM TOKENS (PHASE 4)
 * ============================================================================
 * Master tokens defining the luxury hospitality visual language for all 45
 * phases. Encapsulates palettes, typography scales, spacing, depth/shadows,
 * border radii, animation transitions, accessibility focus rings, and z-index.
 *
 * VISUAL STANDARD:
 * - Dark luxury hotel SaaS: Deep obsidian navy (#070A16, #090D1C)
 * - Brand: Electric Blue (#2563EB), Indigo (#4F46E5), Subtle Cyan/Teal (#06B6D4)
 * - Glass surfaces: Hairline frosted borders, backdrop blurs (0C1022 / 0E1428)
 * - STRICT NO-GOLD GOVERNANCE: Zero gold buttons, borders, text, or gradients.
 * ============================================================================
 */

export const DESIGN_TOKENS = {
  name: "HotelHub Master Hospitality Design System",
  version: "4.0.0",

  /**
   * 1. Semantic Color Palettes (Dark Luxury Hotel SaaS Baseline)
   * Source of truth: HotelHub Master Visual Reference (#070A16 canvas)
   */
  colors: {
    // Brand Tokens (Electric Blue + Indigo + Cyan)
    brand: {
      primary: "#2563EB", // Electric Blue
      primaryHover: "#1D4ED8",
      primaryActive: "#1E40AF",
      secondary: "#4F46E5", // Indigo
      secondaryHover: "#4338CA",
      accent: "#06B6D4", // Subtle Cyan / Teal
      accentHover: "#0891B2",
    },

    // Background Canvas
    background: {
      canvas: "#070A16", // Master obsidian navy canvas
      subtle: "#090D1C", // Secondary section backdrop
      elevated: "#0C1022", // Elevated container backdrop
      glass: "rgba(12, 16, 34, 0.75)",
    },

    // Card & Surface Fills
    surfaces: {
      light: {
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(222.2, 84%, 4.9%)",
        card: "hsl(0, 0%, 100%)",
        cardForeground: "hsl(222.2, 84%, 4.9%)",
        muted: "hsl(210, 40%, 96.1%)",
        mutedForeground: "hsl(215.4, 16.3%, 46.9%)",
        popover: "hsl(0, 0%, 100%)",
        popoverForeground: "hsl(222.2, 84%, 4.9%)",
        border: "hsl(214.3, 31.8%, 91.4%)",
        input: "hsl(214.3, 31.8%, 91.4%)",
      },
      dark: {
        background: "#070A16", // Master deep navy
        foreground: "hsl(210, 40%, 98%)",
        card: "#0C1022", // Luxury card surface
        cardForeground: "hsl(210, 40%, 98%)",
        muted: "hsl(217.2, 32.6%, 17.5%)",
        mutedForeground: "hsl(215, 20.2%, 65.1%)",
        popover: "#0E1428",
        popoverForeground: "hsl(210, 40%, 98%)",
        border: "rgba(255, 255, 255, 0.10)",
        input: "rgba(255, 255, 255, 0.15)",
      },
    },

    // Hairline Borders
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      default: "rgba(255, 255, 255, 0.12)",
      strong: "rgba(255, 255, 255, 0.20)",
      interactive: "rgba(37, 99, 235, 0.40)",
    },

    // Text & Hierarchy
    text: {
      primary: "hsl(210, 40%, 98%)",
      secondary: "hsl(215, 20.2%, 75%)",
      muted: "hsl(215, 20.2%, 60%)",
      disabled: "hsl(215, 16%, 40%)",
    },

    // Operational Status Slabs (Distinct from Brand Palette, NO GOLD)
    status: {
      success: {
        light: "hsl(142.1, 76.2%, 36.3%)", // Emerald
        foreground: "hsl(355.7, 100%, 97.3%)",
        surface: "hsl(142.1, 70.6%, 95.3%)",
      },
      warning: {
        light: "hsl(28, 85%, 48%)", // Pure Amber Warning (functional alert only, not brand gold)
        foreground: "hsl(28, 96%, 92%)",
        surface: "hsl(28, 96%, 95%)",
      },
      error: {
        light: "hsl(0, 84.2%, 60.2%)", // Crimson Rose
        foreground: "hsl(210, 40%, 98%)",
        surface: "hsl(0, 85.7%, 97.3%)",
      },
      info: {
        light: "hsl(221.2, 83.2%, 53.3%)", // Sapphire Blue
        foreground: "hsl(210, 40%, 98%)",
        surface: "hsl(214, 95%, 93%)",
      },
    },

    // Hospitality Domain Statuses
    roomStatus: {
      available: { label: "Available", color: "emerald", code: "AVL" },
      occupied: { label: "Occupied", color: "blue", code: "OCC" },
      reserved: { label: "Reserved", color: "amber", code: "RSV" },
      cleaning: { label: "Cleaning in Progress", color: "purple", code: "CLN" },
      maintenance: { label: "Under Maintenance", color: "rose", code: "MNT" },
      outOfService: { label: "Out of Order", color: "slate", code: "OOO" },
    },

    bookingStatus: {
      confirmed: { label: "Confirmed", variant: "default" },
      checkedIn: { label: "Checked In", variant: "success" },
      checkedOut: { label: "Checked Out", variant: "secondary" },
      pending: { label: "Pending Guarantee", variant: "warning" },
      cancelled: { label: "Cancelled", variant: "destructive" },
      noShow: { label: "No Show", variant: "outline" },
    },
  },

  /** 2. Typography Hierarchy */
  typography: {
    display: {
      fontSize: "2.5rem", // 40px
      lineHeight: "1.15",
      fontWeight: "700",
      letterSpacing: "-0.03em",
      className: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
    },
    h1: {
      fontSize: "2rem", // 32px
      lineHeight: "1.2",
      fontWeight: "600",
      letterSpacing: "-0.025em",
      className: "text-2xl sm:text-3xl font-semibold tracking-tight",
    },
    h2: {
      fontSize: "1.5rem", // 24px
      lineHeight: "1.25",
      fontWeight: "600",
      letterSpacing: "-0.02em",
      className: "text-xl sm:text-2xl font-semibold tracking-tight",
    },
    h3: {
      fontSize: "1.25rem", // 20px
      lineHeight: "1.3",
      fontWeight: "600",
      letterSpacing: "-0.015em",
      className: "text-lg sm:text-xl font-semibold",
    },
    h4: {
      fontSize: "1rem", // 16px
      lineHeight: "1.4",
      fontWeight: "600",
      letterSpacing: "-0.01em",
      className: "text-base font-semibold",
    },
    body: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.5",
      fontWeight: "400",
      className: "text-sm leading-relaxed",
    },
    small: {
      fontSize: "0.75rem", // 12px
      lineHeight: "1.4",
      fontWeight: "400",
      className: "text-xs",
    },
    caption: {
      fontSize: "0.6875rem", // 11px
      lineHeight: "1.3",
      fontWeight: "500",
      letterSpacing: "0.02em",
      className: "text-[11px] font-medium tracking-wide",
    },
    label: {
      fontSize: "0.75rem", // 12px
      lineHeight: "1",
      fontWeight: "500",
      className: "text-xs font-medium",
    },
    button: {
      fontSize: "0.875rem",
      lineHeight: "1",
      fontWeight: "500",
      letterSpacing: "0.01em",
      className: "text-xs sm:text-sm font-medium",
    },
  },

  /** 3. Spacing Scale & Layout Constraints */
  spacing: {
    page: {
      paddingX: "px-4 sm:px-6 lg:px-8",
      paddingY: "py-6 sm:py-8 lg:py-10",
      maxWidth: "max-w-7xl",
      className: "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
    },
    card: {
      paddingSm: "p-3 sm:p-4",
      paddingMd: "p-4 sm:p-5",
      paddingLg: "p-5 sm:p-6 lg:p-7",
    },
    form: {
      rowGap: "gap-4 sm:gap-6",
      fieldGap: "space-y-1.5",
    },
    grid: {
      gapSm: "gap-3",
      gapMd: "gap-4 sm:gap-5",
      gapLg: "gap-6",
    },
    sidebar: {
      widthDesktop: "w-64 lg:w-72",
      headerHeight: "h-14 sm:h-16",
    },
  },

  /** 4. Border Radius Scale */
  radius: {
    xs: "0.125rem", // 2px
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.625rem", // 10px (default luxury card radius)
    xl: "0.875rem", // 14px
    "2xl": "1.125rem", // 18px
    full: "9999px",
  },

  /** 5. Elevation & Shadows Scale */
  shadows: {
    subtle: "shadow-2xs", // Subtle card hairline
    card: "shadow-xs", // Standard content card
    elevated: "shadow-sm", // Active or hover card
    modal: "shadow-lg", // Dialog / Drawer
    glass: "shadow-md backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60",
  },

  /** 6. Blur Scale */
  blur: {
    sm: "backdrop-blur-xs",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-xl",
  },

  /** 7. Z-Index Hierarchy */
  zIndex: {
    base: 0,
    dropdown: 50,
    stickyHeader: 40,
    mobileSidebar: 50,
    backdrop: 50,
    dialog: 50,
    popover: 50,
    tooltip: 60,
    toast: 100,
  },

  /** 8. Breakpoints */
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  /** 9. Transitions & Micro-Interactions */
  transitions: {
    fast: "transition-all duration-150 ease-out",
    normal: "transition-all duration-200 ease-in-out",
    smooth: "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)",
    fade: "transition-opacity duration-200 ease-in-out",
  },

  /** 10. Focus Rings & Accessibility Standards */
  accessibility: {
    focusRing: "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    touchTargetMin: "min-h-[44px] min-w-[44px]",
    contrastTextLight: "#0F172A", // 14:1 contrast ratio against white
    contrastTextDark: "#F8FAFC", // 15:1 contrast ratio against dark slate
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
