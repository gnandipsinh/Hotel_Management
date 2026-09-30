# HotelHub — Master Folder Structure Specification

> **Phase 3 Baseline**  
> **Status**: Approved & Active  
> **Scope**: Master Folder Structure and File Organization for the Complete 45-Phase Hotel Management SaaS  
> **Visual Reference**: Master Dark Luxury Design System (Obsidian/Navy `#070A16`, Electric Blue `#2563EB`, Indigo `#4F46E5`, Cyan `#06B6D4`, Glass Surfaces — **Zero Gold**)

---

## 1. Directory Tree Architecture

The HotelHub codebase is structured to provide clean separation of concerns, strict modularity, and smooth scaling across all 45 development phases:

```
/
├── app/                      # Next.js App Router (Pages, Layouts, API Routes)
│   ├── api/                  # Backend REST API Routes (/api/[module]/...)
│   ├── dashboard/            # Hotel Front Desk & Operations Dashboard
│   ├── admin/                # Platform Super Admin Governance Panel
│   ├── manager/              # General Manager Operational Suite
│   ├── security/             # Security, Visitor & Keycard Panel
│   ├── settings/             # Property Settings & Media Management
│   ├── onboarding/           # 7-Step Hotel Tenant Onboarding Flow
│   ├── login/                # Role Selector & 1-Click Demo Login
│   ├── design-system/        # Living Component & Token Showcase
│   ├── layout.tsx            # Global Root Layout (Fonts, ThemeProvider, Toaster)
│   ├── globals.css           # Tailwind v4 Styles & Master Dark Theme Tokens
│   └── page.tsx              # Approved HotelHub Dark Luxury Landing Page
│
├── components/               # Presentation & UI Component Architecture
│   ├── ui/                   # Generic Reusable Primitives (Radix / shadcn)
│   ├── landing/              # Landing Page Sections & Preview Modals
│   ├── layout/               # Shell, Sidebar, Navigation, Topbar
│   ├── hospitality/          # Domain-Specific Cards (Room, Booking, Occupancy)
│   ├── dashboard/            # Dashboard Widgets, KPI Cards, Charts
│   ├── onboarding/           # Multi-step Onboarding Forms & Stepper
│   ├── demo/                 # Demo Route Guard, User Switcher, Login Form
│   ├── media/                # File Upload, Image Preview, Media Library
│   ├── navigation/           # Branch Switcher, Theme Switcher
│   ├── notifications/        # Real-time Notification Center & Feed
│   ├── search/               # Omnibox Global Search Dialog
│   ├── states/               # Loading, Empty, Error, Skeleton States
│   ├── shared/               # Barrel Exports for Cross-Application Components
│   └── theme-provider.tsx    # Next-Themes Wrapper
│
├── config/                   # Centralized Configuration & Fixtures
│   ├── app.ts                # Application Metadata, Tax Slabs (SAC 9963), Limits
│   ├── demo.ts               # 14 Role Fixtures, Demo Accounts, Module Mappings
│   ├── navigation.ts         # Navigation Trees, Route Protection, Entitlements
│   └── onboarding.ts         # 7-Step Onboarding Schemas & Module Catalog
│
├── docs/                     # Engineering & Architecture Documentation
│   ├── architecture.md       # Master 18-Section System Architecture
│   ├── folder-structure.md   # This Master Folder Structure Guide
│   ├── phase1-foundation.md  # Phase 1 Baseline & 45-Phase Roadmap
│   ├── design-system.md      # Dark Luxury Color & Token Specifications
│   ├── domain-glossary.md    # Hospitality SaaS Domain Terminology
│   └── product-discovery.md  # Market & Feature Requirements Blueprint
│
├── hooks/                    # Reusable React Custom Hooks
│   ├── use-file-upload.ts    # Client-side File Upload State Machine
│   └── use-media-query.ts    # Responsive Viewport Breakpoint Detector
│
├── lib/                      # Technical Infrastructure & Pure Utilities
│   ├── db/                   # MongoDB Connection, Error Normalization, Scoping
│   ├── storage/              # StorageProvider Abstraction (Cloudinary & Local)
│   ├── validation/           # Domain Validators (GSTIN, PAN, Phone, Slug)
│   ├── constants/            # Room, Booking, Payment Status Constants
│   ├── demo/                 # Demo Session Manager & Storage Serialization
│   ├── design-system/        # Design Tokens, Color Palettes, Elevations
│   ├── media/                # Media API Client Helpers
│   ├── onboarding/           # Onboarding Form State Reducer & Storage
│   └── utils.ts              # ClassName Merger (`cn` = clsx + twMerge)
│
├── models/                   # Mongoose Multi-Tenant Schemas
│   ├── Hotel.ts              # Hotel Tenant & Subscription Model
│   ├── Branch.ts             # Property Branch Entity Model
│   ├── User.ts               # User Account Model (Scoped to Hotel & Branches)
│   ├── Role.ts               # Role Definition & Permission Links
│   ├── Permission.ts         # Granular Action Permission Model
│   ├── Module.ts             # Global Module Catalog Model
│   ├── HotelModule.ts        # Hotel Tenant Module Entitlement Join
│   ├── FileAsset.ts          # Uploaded Media Asset Metadata Model
│   └── AuditLog.ts           # Append-Only Security & Operational Audit Log
│
├── scripts/                  # Automated Test Suites & Database Seeding
│   ├── phase6-test.ts        # MongoDB Atlas & Mongoose Validation Suite
│   ├── phase7-test.ts        # Storage Provider & Upload Validation Suite
│   ├── phase8-test.ts        # Demo Auth & 14-Role Panel Route Test Suite
│   ├── phase9-test.ts        # 7-Step Onboarding Stepper Test Suite
│   └── seed.ts               # Database Seeder (Roles, Modules, Test Hotel)
│
├── services/                 # Pure Domain & Business Logic Services
│   ├── hotel/                # Hotel Tenant Business Operations
│   ├── branch/               # Multi-Branch Hierarchy Service
│   ├── module/               # Catalog & Entitlement Service
│   ├── file/                 # Media File Storage & Asset Registry Service
│   └── seed/                 # Database Seeding Service
│
└── types/                    # Shared TypeScript Interface Definitions
    ├── index.ts              # Centralized Barrel Export for `@/types`
    ├── common.ts             # ApiResponse<T>, Pagination, DateRange, SelectOption
    ├── context.ts            # HotelInfo, BranchInfo, UserProfile, TenantContext
    ├── dashboard.ts          # KPI, RoomTile, OccupancyDay, DashboardState
    ├── media.ts              # FileAsset, UploadProgress, MediaFilter
    ├── navigation.ts         # NavItem, NavigationConfig, CustomerModuleKey
    └── onboarding.ts         # OnboardingState, OnboardingBranch, ReviewSummary
```

---

## 2. Directory Purposes & Architectural Responsibilities

| Directory | Primary Purpose | What Belongs Here | What is Forbidden |
|---|---|---|---|
| `app/` | Next.js App Router routing | Route entry points (`page.tsx`), layouts (`layout.tsx`), error handlers, and `/api/*` endpoints. | Heavy domain calculations, direct database schemas, raw secret storage. |
| `components/` | Presentation UI | Client and server React visual components organized by feature and domain. | Direct database operations, server-only secret usage, raw HTTP fetchers. |
| `config/` | Application settings | Centralized constants, navigation trees, onboarding steps, role definitions. | Dynamic database queries, session mutation logic. |
| `lib/` | Technical infrastructure | Pure utilities, database connection, storage abstraction, validators, design tokens. | React UI components, page layouts, direct presentation markup. |
| `models/` | Data access layer | Mongoose schemas, compound indexes, field validation rules. | UI rendering, HTTP request/response parsing. |
| `services/` | Domain business logic | Pure TypeScript business operations, transactional state machines, rate calculation. | Direct JSX rendering, Next.js `NextRequest`/`NextResponse` dependencies. |
| `scripts/` | Tooling & verification | Automated test suites (`phaseX-test.ts`) and data seeders. | Application runtime code. |
| `types/` | Static type definitions | Shared TypeScript interfaces, union types, and enums. | Executable JavaScript logic or runtime side-effects. |

---

## 3. Component Organization Matrix

```
components/
├── ui/              → Atoms: button, dialog, input, table, badge, popover
├── landing/         → Landing page sections: hero, navbar, features, pricing, why, demo
├── hospitality/     → Hotel domain visual cards: room-card, booking-summary, occupancy-card
├── dashboard/       → Dashboard views: kpi-card, room-status-tiles, occupancy-chart
├── layout/          → Shell: app-shell, sidebar, topbar, page-container
├── navigation/      → Switchers: hotel-branch-switcher, theme-switcher
├── demo/            → Demo gates: demo-route-guard, login-form, demo-user-switcher
├── onboarding/      → Stepper: onboarding-shell, steps/step[1-7]
├── media/           → Uploaders: image-upload, file-list, media-gallery
├── shared/          → Re-exports for common primitives (data-state, responsive-table)
└── states/          → State visualizers: loading-state, empty-state, error-state
```

---

## 4. Naming Conventions

To maintain strict codebase consistency:

1. **React Components**: `PascalCase` file names and exports (e.g., `RoomStatusTiles.tsx`, `KpiCard.tsx`).
2. **Component Folders & Helpers**: `kebab-case` file names (e.g., `room-status-tiles.tsx`, `dashboard-view.tsx`).
3. **Custom Hooks**: `useCamelCase` file names prefixed with `use` (e.g., `useOnboarding.ts`, `useMediaQuery.ts`).
4. **Services**: `camelCase` with `Service` suffix (e.g., `hotelService.ts`, `branchService.ts`).
5. **Mongoose Models**: `PascalCase` file names matching the model name (e.g., `Hotel.ts`, `Branch.ts`, `AuditLog.ts`).
6. **Configuration Files**: `kebab-case` or `camelCase` descriptive files (e.g., `navigation.ts`, `onboarding.ts`, `app.ts`).
7. **Type Files**: `kebab-case` or domain-based names (e.g., `context.ts`, `common.ts`, `navigation.ts`).
8. **API Route Folders**: `lowercase` REST nouns matching resources (e.g., `app/api/hotel/`, `app/api/branch/`).

---

## 5. Import Aliases

The project utilizes the centralized `@/*` path alias mapped to the repository root in `tsconfig.json`:

```ts
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app";
import { connectDB } from "@/lib/db/mongoose";
import { validateGSTIN } from "@/lib/validation";
import { Hotel } from "@/models/Hotel";
import { createHotel } from "@/services/hotel/hotelService";
import type { TenantContext, ApiResponse } from "@/types";
```

No relative upward traversal (e.g., `../../../components`) should be used when `@/` cleanly resolves the module.

---

## 6. Route Stability & Preservation Rule

**Critical Architectural Directive**:
- User-facing routes (`/`, `/dashboard`, `/admin`, `/manager`, `/security`, `/settings`, `/login`, `/onboarding`) remain at their established filesystem locations within `app/`.
- Hardcoded filesystem path assertions in automated test suites (`scripts/phase8-test.ts` and `scripts/phase9-test.ts`) are preserved without disruption.
- No artificial route groups (`(public)` or `(hotel)`) are introduced that would alter or risk breaking public URLs or test suites.

---

## 7. No-Gold Visual Governance

All UI components across all folders strictly enforce the master dark luxury design system:
- **Surfaces**: Obsidian (`#070A16`), deep navy (`#090D1C`), glass cards (`bg-slate-900/60`, `backdrop-blur-xl`, `border-white/10`).
- **Accents**: Electric blue (`#2563EB`, `#3B82F6`), indigo (`#4F46E5`, `#6366F1`), cyan (`#06B6D4`, `#22D3EE`).
- **Strict Ban on Gold**: Zero gold hex codes, gold gradients, gold borders, or gold buttons in any component.
