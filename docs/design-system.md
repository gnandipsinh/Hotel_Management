# HotelHub Master Hospitality Design System (Phase 4)

The HotelHub design system provides the visual and architectural foundation for the entire 45-phase SaaS platform. Designed specifically for luxury hotels, boutique resorts, multi-property chains, and heritage hospitality groups, it balances high-end aesthetics with fast, accessible operational workflows.

The approved **HotelHub landing page** is the master visual baseline. Every panel, dashboard, form, modal, table, card, navigation system, and customer-facing interface belongs to this unified luxury system.

---

## 1. Visual Direction & Master Constitution

### Visual Identity
- **Master Canvas**: Deep obsidian navy (`#070A16`) and deep nocturnal blue (`#090D1C`).
- **Brand Colors**:
  - Primary: Electric Blue (`#2563EB`)
  - Secondary: Deep Indigo (`#4F46E5`)
  - Accent: Cyan / Teal (`#06B6D4`, `#22D3EE`)
- **Luxury Surfaces**: Hairline frosted borders (`border-white/10`, `border-white/20`), backdrop blurs (`backdrop-blur-md`, `backdrop-blur-xl`), and dark glass card surfaces (`#0C1022`, `#0E1428`).
- **Zero-Pill Discipline**: Static metadata (such as timestamps, room numbers, floor numbers) is rendered as quiet inline text separated by subtle typographic dots (`·`), avoiding juvenile colorful pill clusters.
- **Intentional Depth**: Hairline borders, frosted glass backdrops, and layered elevation (`shadow-xs` to `shadow-md`) instead of jarring heavy drop shadows.
- **Accessibility by Default**: Minimum 4.5:1 contrast ratio, standard visible focus rings (`focus-visible:ring-2 focus-visible:ring-primary/40`), and 44px minimum touch targets.

---

## 2. Absolute No-Gold Governance

**DO NOT USE GOLD OR GOLDEN COLORS ANYWHERE.**

- Strict ban on gold buttons, gold borders, gold text, gold icons, gold gradients, gold shadows, gold highlights, golden cards, and champagne/gold luxury accents.
- Modern luxury is communicated through typography, architectural spacing, high-resolution imagery, subtle cyan/blue backdrops, and precision glass surfaces.
- Operational status colors (e.g. Warning Amber, Error Crimson, Success Emerald) are strictly reserved for functional alerts and never used as brand/luxury themes.

---

## 3. Centralized Design Tokens

Centralized in `@/lib/design-system/tokens.ts` and `@/lib/design-system/index.ts`:

### Semantic Colors
- **Canvas / Background**:
  - `background.canvas`: Master deep obsidian `#070A16`
  - `background.subtle`: Secondary container `#090D1C`
  - `background.elevated`: Elevated surface `#0C1022`
  - `background.glass`: `rgba(12, 16, 34, 0.75)`
- **Brand**:
  - `brand.primary`: `#2563EB` (Electric Blue)
  - `brand.secondary`: `#4F46E5` (Indigo)
  - `brand.accent`: `#06B6D4` (Cyan / Teal)
- **Surfaces**:
  - `card`: `#0C1022` (Dark Luxury Card Surface)
  - `border`: `rgba(255, 255, 255, 0.10)`
  - `input`: `rgba(255, 255, 255, 0.15)`
- **Status Slabs** (Functional alerts only, distinguishable from brand):
  - `success`: Emerald (`#10B981`)
  - `warning`: Pure Amber Warning (`hsl(28, 85%, 48%)`)
  - `error`: Crimson Rose (`#EF4444`)
  - `info`: Sapphire Blue (`#3B82F6`)

### Typography Scale
| Level | Font Size | Tracking | Weight | Class |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | 40px–48px | `-0.03em` | Bold (700) | `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight` |
| **H1** | 30px–36px | `-0.025em` | Semibold (600) | `text-2xl sm:text-3xl font-semibold tracking-tight` |
| **H2** | 24px–30px | `-0.02em` | Semibold (600) | `text-xl sm:text-2xl font-semibold tracking-tight` |
| **H3** | 20px–24px | `-0.015em` | Semibold (600) | `text-lg sm:text-xl font-semibold` |
| **H4** | 18px–20px | `-0.01em` | Semibold (600) | `text-base font-semibold` |
| **Body** | 14px–16px | Normal | Regular (400) | `text-sm leading-relaxed text-foreground` |
| **Small** | 12px–14px | Normal | Regular (400) | `text-xs text-muted-foreground` |
| **Caption** | 11px–12px | `0.02em` | Medium (500) | `text-[11px] font-medium tracking-wide text-muted-foreground` |
| **Label** | 12px | Normal | Medium (500) | `text-xs font-medium text-foreground` |

### Spacing & Layout Scale
- **Page Container**: `mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8`
- **Card Padding**: `p-4 sm:p-5 lg:p-6`
- **Form Row Gap**: `gap-4 sm:gap-6`
- **Grid Gaps**: `gap-4 sm:gap-5`
- **Border Radii**:
  - `sm`: 6px (`rounded-md`)
  - `md`: 8px (`rounded-lg`)
  - `lg`: 10px (`rounded-xl` / default luxury card radius)
  - `xl`: 14px
  - `2xl`: 18px (`rounded-2xl`)
  - `full`: 9999px

---

## 4. Core UI Components

Located in `@/components/ui/`:
- `Button`: Luxury primary, secondary, outline, ghost, destructive, and icon sizes (`xs`, `sm`, `default`, `lg`, `icon`).
- `IconButton`: Accessible button requiring an explicit label, optional tooltip, and loading state.
- `Input` & `Textarea`: Hairline borders, focus glow, placeholder styling, and error states.
- `FormField`: Standard form container with Label, Required asterisks, helper description, and inline error.
- `Select`: Radix UI select dropdown with luxury item styling.
- `Checkbox`, `RadioGroup`, `Switch`: Form toggles with clear accessible focus rings.
- `Card` & `GlassCard`: Standard card containers and frosted luxury backdrop cards.
- `Dialog`, `AlertDialog` & `ConfirmationDialog`: Accessible modal overlays and confirmation alerts.
- `Sheet`: Slide-over drawer for mobile navigation and room side panels.
- `Progress`: Accessible progress bar with percentage animations.
- `Alert`: Alert container with default, destructive, success, warning, and info variants.
- `Pagination`: Accessible page navigation with ellipsis, previous, and next links.
- `Badge`: Standard and status tags.
- `Avatar`: User and guest avatars.
- `Tabs`: Segmented controls with keyboard navigation.
- `Accordion`: Expandable question and section disclosures.
- `Table`: Luxury data table with header styling, hover states, and responsive scrolling.
- `Skeleton`: Shimmer pulse placeholders for loading cards and tables.
- `EmptyState`, `ErrorState`, `LoadingState`: Standardized state feedback components (in `@/components/states/` and `@/components/shared/`).

---

## 5. Hospitality Components

Located in `@/components/hospitality/`:
1. `RoomStatusBadge`: Color-coded status for Available (emerald), Occupied (blue), Reserved (amber), Cleaning (purple), Maintenance (rose), and Out of Order (slate).
2. `BookingStatusBadge`: Reservation status badge (Confirmed, Checked In, Checked Out, Pending, Cancelled, No Show).
3. `GuestAvatar`: Avatar with initials fallback and cyan/indigo VIP crown indicator.
4. `HotelCard`: Property summary card with branch count, room count, and management CTA.
5. `HotelImageCard`: High-resolution photo card with vignette overlay and cyan-accented star rating badge.
6. `RoomCard`: Room inventory card with room number, category, floor, status badge, guest occupant, and tariff.
7. `GuestCard`: Guest folio profile card with stay history and contact links.
8. `BranchCard`: Property branch card with branch code and primary branch badge.
9. `ModuleCard`: Operational service card with icon, recommended tag, and open console shortcut.
10. `RevenueCard`: Financial KPI card displaying Total Revenue, ADR, RevPAR, and period change percentage.
11. `OccupancyCard`: Property occupancy card with progress bar and arrivals/turnover breakdown.
12. `BookingSummary`: Reservation summary with check-in/out dates, room number, total tariff, and folio action.
13. `RoomAvailability`: Interactive room matrix block grid with quick status filtering.
14. `ActivityTimeline`: Timestamped front-desk events log (Check-in, Check-out, Turnover, Billing, Maintenance).
15. `DashboardMetricCard`: Standard metric card for ADR, Occupancy, Arrivals, and staff indicators.

---

## 6. Dashboard Layout Primitives

Located in `@/components/dashboard/dashboard-primitives.tsx`:
- `MetricGrid`: Responsive 2/3/4 column KPI grid.
- `ContentGrid`: Split layout (`2/3` main content + `1/3` sidebar).
- `ChartContainer`: Reusable analytics card with title, subtitle, and action buttons.
- `ActivitySection`: Wrapper for operational logs.
- `TableSection`: Card wrapper for tables with search toolbar and pagination.
- `SidebarWidget`: Utility card for shift handovers and weather notes.

---

## 7. Do's & Don'ts

### DO:
- ✅ Use `PageContainer` for every page view to maintain 1440px max-width and responsive margins.
- ✅ Use `FormField` for inputs to automatically wire up `id`, `label`, `aria-describedby`, and error messages.
- ✅ Use `RoomStatusBadge` and `BookingStatusBadge` rather than custom color strings.
- ✅ Ensure interactive elements have working click handlers and focus visible outlines.
- ✅ Test all views in both light mode and dark mode.
- ✅ Adhere to the `#070A16` obsidian / Electric Blue `#2563EB` / Cyan `#06B6D4` master palette.

### DON'T:
- ❌ **NEVER USE GOLD**: Zero gold buttons, borders, text, icons, gradients, shadows, or cards.
- ❌ Do not invent custom pill badges for static metadata (e.g. `2026-09-30` or `Floor 2`). Use unboxed text with `·` separators.
- ❌ Do not hard-code arbitrary hex colors like `#00ff00` inside feature components. Use design token classes (`text-primary`, `bg-card`, `border-border`).
- ❌ Do not create conflicting upload or dialog systems.
- ❌ Do not allow horizontal scrollbars on mobile devices (320px–414px).
